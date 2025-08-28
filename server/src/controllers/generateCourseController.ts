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
        select: { chapter: true }
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


    // 2) Playlist Maker Instance
    const pm = new PlaylistMaker(extractedTopics, subject);
    const searchedPlaylists = await pm.fetchPlaylistVideos(req._cooked_client, req.query)

    res.status(200).json({ "message": "success", data: searchedPlaylists })
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
