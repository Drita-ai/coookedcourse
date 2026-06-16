import { NextFunction, Request, Response } from 'express'
import axios from 'axios'

import type { CookedTopics } from '../types/cookedcourse'

import catchAsync from '../utils/catchAsync'
import { PlaylistMaker } from '../utils/playlist-maker/PlaylistMaker'
import prisma from '../utils/prisma-client/getPrismaClient'

// AI-AGENT API Route
const AGENT_ROUTE = 'http://agent_container:8000/api/v1/agent'

const generateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.__cc_final_syllabus, req.__cc_reference_ids)
    let extractedTopics: CookedTopics = {};

    // 1) GET Topics of SYLLABUS from AI-AGENT
    if (Object.keys(req.__cc_final_syllabus!).length !== 0) {
        extractedTopics = (await axios.post(`${AGENT_ROUTE}/generate-topics`, {
            syllabus: req.__cc_final_syllabus
        })).data

        // Save the extractedTopics in DB to serve in further queries 
        await saveToDB(Object.values(extractedTopics), Object.values(req.__cc_final_syllabus!))
    }

    const subject: string = req.body.subject;

    // Get all extracted Units from reference ids
    const storedUnitData = await prisma.unit.findMany({
        where: { id: { in: req.__cc_reference_ids } },
        include: {
            chapter: {
                include: {
                    chapterAnalysis: {
                        include: {
                            matchedYoutubeTitles: true,
                            fallbackVideos: true
                        }
                    }
                }
            }
        }
    })

    let initialUnitCount = 0;
    let extractedTopicsLength = Object.keys(extractedTopics).length;

    if (extractedTopicsLength !== 0) {
        const lastKey = Object.keys(extractedTopics)[extractedTopicsLength - 1];
        initialUnitCount = Number(lastKey.charAt(lastKey.length - 1))
    }

    // Structure Unit data from DB along with extracted topics
    extractedTopics = storedUnitData.reduce((acc, chapter, i) => {
        const key = `Unit${i + 1 + initialUnitCount}`;

        acc[key] = chapter.chapter;
        return acc;
    }, extractedTopics as Record<string, any>)

    // Retrieve 'Chapters' data from DB and turn it into flat array
    const chaptersData = storedUnitData.flatMap((unitData) => unitData.chapter.map(el => el)) as any;

    // 2) Playlist Maker Instance
    if (Object.keys(req.__cc_final_syllabus!).length !== 0) {
        const pm = new PlaylistMaker(extractedTopics, subject);
        const { analyzedTopicsToSave } = await pm.fetchPlaylistVideos(req._cooked_client, req.query, chaptersData);

        const insertPromises = analyzedTopicsToSave.map(analyzedTopic => prisma.chapterAnalysis.create({ data: analyzedTopic }))
        await prisma.$transaction(insertPromises);
    }

    // Flat array of all chapters from DB
    const allChapters = storedUnitData.flatMap(unit => unit.chapter);

    // Memory store to capture freshly fetched fallback configurations
    const fallbackInMemoryMap: Record<string, Array<{ topicName: string; ytVideoTitle: string; ytVideoId: string }>> = {};

    if (Object.keys(req.__cc_final_syllabus!).length !== 0) {
        // Map unique unmatched topics ONLY if they have not been processed previously
        const topicToAnalysisMap = new Map<string, { topic: string; analysisIds: string[] }>();

        allChapters.forEach(chapter => {
            chapter.chapterAnalysis.forEach(analysis => {
                // CONDITION CHECK: If this analysis already has fallback entries in DB, skip generation entirely
                if (analysis.fallbackVideos && analysis.fallbackVideos.length > 0) {
                    return;
                }

                analysis.unmatchedSyllabusTopics.forEach(topic => {
                    const uniqueKey = `${chapter.id}-${topic.trim().toLowerCase()}`;

                    if (!topicToAnalysisMap.has(uniqueKey)) {
                        topicToAnalysisMap.set(uniqueKey, {
                            topic: topic.trim(),
                            analysisIds: [analysis.id]
                        });
                    } else {
                        topicToAnalysisMap.get(uniqueKey)!.analysisIds.push(analysis.id);
                    }
                });
            });
        });

        // Only consume API quotas if there are un-cached elements left to process
        if (topicToAnalysisMap.size > 0) {
            const fallbackPromises: any[] = [];

            for (const [_, item] of topicToAnalysisMap) {
                try {
                    const searchQuery = encodeURIComponent(`${subject} ${item.topic} engineering`);
                    const ytSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${searchQuery}&key=${process.env.YOUTUBE_API}`;

                    const response = await axios.get(ytSearchUrl);
                    const searchItems = response.data?.items;

                    if (searchItems && searchItems.length > 0) {
                        const topVideo = searchItems[0];
                        const videoData = {
                            topicName: item.topic,
                            ytVideoTitle: topVideo.snippet.title,
                            ytVideoId: topVideo.id.videoId
                        };

                        item.analysisIds.forEach(analysisId => {
                            // Queue write transactions to persistent DB
                            fallbackPromises.push(
                                prisma.chapterAnalysisFallback.create({
                                    data: {
                                        ...videoData,
                                        chapterAnalysisId: analysisId
                                    }
                                })
                            );

                            // Queue to runtime memory map for fast deployment to response
                            if (!fallbackInMemoryMap[analysisId]) {
                                fallbackInMemoryMap[analysisId] = [];
                            }
                            fallbackInMemoryMap[analysisId].push(videoData);
                        });
                    }
                } catch (error) {
                    console.error(`Failed fallback fetch for topic: ${item.topic}`, error?.message);
                    continue;
                }
            }

            if (fallbackPromises.length > 0) {
                await prisma.$transaction(fallbackPromises);
            }
        }
    }

    // These are used for navigation, for now
    const navChapters = allChapters.map(ch => ({
        id: ch.id,
        name: ch.name
    }));

    // Set to add only unique channels
    const uniqueChannels = new Set();
    const analysisMap = {};

    allChapters.forEach(chapter => {
        chapter.chapterAnalysis.forEach(analysis => {
            const channelName = analysis.channelName;
            uniqueChannels.add(channelName);

            // channel key
            if (!analysisMap[channelName]) {
                analysisMap[channelName] = {};
            }

            const savedFallbackVideos = analysis.fallbackVideos?.map(fb => ({
                topicName: fb.topicName,
                ytVideoTitle: fb.ytVideoTitle,
                ytVideoId: fb.ytVideoId
            })) || [];

            const freshFallbackVideos = fallbackInMemoryMap[analysis.id] || [];

            const combinedFallbacksMap = new Map<string, { topicName: string; ytVideoTitle: string; ytVideoId: string }>();
            [...savedFallbackVideos, ...freshFallbackVideos].forEach(item => {
                combinedFallbacksMap.set(item.topicName.toLowerCase().trim(), item);
            });

            // Map data directly to the specific chapter ID
            analysisMap[channelName][chapter.id] = {
                analysisId: analysis.id,
                unitCoveragePercentage: analysis.unitCoveragePercentage,
                matchedSyllabusTopics: analysis.matchedSyllabusTopics,
                unmatchedSyllabusTopics: analysis.unmatchedSyllabusTopics,
                videos: analysis.matchedYoutubeTitles.map(vid => ({
                    ytVideoTitle: vid.ytVideoTitle,
                    ytVideoId: vid.ytVideoId
                })),
                fallbackVideos: Array.from(combinedFallbacksMap.values())
            };
        });
    });

    res.status(200).json({
        "message": "success",
        navChapters,
        channels: Array.from(uniqueChannels),
        analysisMap
    })
})

const checkInDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { syllabus, subject, client: clientId } = req.body;

    // Find existing USER 
    const user = await prisma.user.findUnique({
        where: {
            clientId
        }
    })

    // If USER doesn't exist, create one
    if (!user) {
        const user = await prisma.user.create({
            data: {
                clientId
            }
        })
    }

    // Check for already created course based on the syllabus
    let extractedSyllabus = (Object.entries(syllabus)).map(async (el, i) => {
        // Find the Syllabus
        const searchedSyllabus = await prisma.syllabus.findFirst({
            where: {
                syllabus: el[1]!
            }
        })
        // If Syllabus doesn't exist, return it
        if (!searchedSyllabus) return { unit: el[1] }

        // If exists, return llm generated syllabus reference id 
        return searchedSyllabus.unitId;
    })
    let results = await Promise.all(extractedSyllabus);

    // Separate reference id and unit object
    req.__cc_reference_ids = results.filter(item => typeof item === 'string');
    const unitsObj = results.filter(item => typeof item === 'object' && item !== null);

    req.__cc_final_syllabus = unitsObj.reduce((acc, unit, i) => {
        const key = `unit${i + 1}`;

        acc[key] = unit.unit;

        return acc;
    }, {} as Record<string, any>);

    next();
})

const saveToDB = async (unitData: any, syllabus: string[]) => {
    try {
        for (let i = 0; i < unitData.length; i++) {
            // Create Unit
            const unit = await prisma.unit.create({
                data: {},
            });

            // Create Syllabus
            await prisma.syllabus.create({
                data: {
                    syllabus: syllabus[i],
                    unitId: unit.id,
                },
            });

            // Create chapters
            const chapters = unitData[i];
            for (const chapter of chapters) {
                await prisma.chapter.create({
                    data: {
                        name: chapter.name,
                        topics: chapter.topics,
                        unitId: unit.id,
                    },
                });
            }
        }
    } catch (err) {
        console.error(err)
    }
}

export default { generateCourse, checkInDB }
