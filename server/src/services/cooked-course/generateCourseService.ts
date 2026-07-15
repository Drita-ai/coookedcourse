import axios from 'axios';

import { CookedTopics } from '../../types/cookedcourse';
import prisma from '../../utils/prisma-client/getPrismaClient';
import { PlaylistMaker } from '../../utils/playlist-maker/PlaylistMaker';
import { extractSyllabusTopics } from '../llm/agentService';
import { saveTopicsToDB } from './cookedcourseDbService';
import { getRedisClient } from '../../utils/redis-client/getRedisClient';


export const createCourse = async (
  toExtractTopicsOfChapters,
  toAnalyzeChapters,
  alreadyExtractedChapters,
  clientId,
  currSubject,
  query
) => {
  console.log(toExtractTopicsOfChapters, alreadyExtractedChapters)
  let extractedTopics: CookedTopics = {};

  // GET Topics of SYLLABUS from AI-AGENT, if course has not been generated
  // for the same SYLLABUS or UNITS
  if (toExtractTopicsOfChapters.length !== 0) {
    let newExtractedTopics: string | "";
    if (!(await (await getRedisClient()).get(`new-extracted-topics#${clientId}`))) {
      newExtractedTopics = await extractSyllabusTopics(toExtractTopicsOfChapters);
      (await getRedisClient()).set(`new-extracted-topics#${clientId}`, JSON.stringify(newExtractedTopics))
    }

    const cachedExtractedTopics = await (await getRedisClient()).get(`new-extracted-topics#${clientId}`)

    newExtractedTopics = cachedExtractedTopics ? JSON.parse(cachedExtractedTopics) : null;

    await saveTopicsToDB(toExtractTopicsOfChapters, newExtractedTopics);
  }

  const subject: string = currSubject;

  const playlistGenerationTopics = [...toExtractTopicsOfChapters, ...toAnalyzeChapters];

  const playlistGenerationTopicsData = await prisma.chapter.findMany({
    where: { chapterData: { in: playlistGenerationTopics } },
    select: {
      id: true,
      name: true,
      topics: true
    }
  })

  // Playlist Maker Instance
  if (playlistGenerationTopics.length !== 0) {
    const pm = new PlaylistMaker(playlistGenerationTopicsData, subject);
    const { analyzedTopicsToSave } = await pm.fetchPlaylistVideos(clientId, query, playlistGenerationTopicsData);

    const insertPromises = analyzedTopicsToSave.map(analyzedTopic => prisma.chapterAnalysis.create({ data: analyzedTopic }))
    await prisma.$transaction(insertPromises);
  }

  // fetch all chapters from DB
  const allChapters = await prisma.chapter.findMany({
    where: { chapterData: { in: [...playlistGenerationTopics, ...alreadyExtractedChapters] } },
    include: {
      chapterAnalysis: {
        include: {
          matchedYoutubeTitles: true,
          fallbackVideos: true
        }
      }
    }
  })

  // Memory store to capture freshly fetched fallback configurations
  const fallbackInMemoryMap: Record<string, Array<{ topicName: string; ytVideoTitle: string; ytVideoId: string }>> = {};

  if (Object.keys(playlistGenerationTopics).length !== 0) {
    // Map unique unmatched topics ONLY if they have not been processed previously
    const topicToAnalysisMap = new Map<string, { topic: string; analysisIds: string[] }>();

    allChapters.forEach(chapter => {
      chapter.chapterAnalysis.forEach(analysis => {
        // If this analysis already has fallback entries in DB, skip generation entirely
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

  return { navChapters, uniqueChannels, analysisMap }
}