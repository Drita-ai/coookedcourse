import { NextFunction, Request, Response } from 'express'
import axios from 'axios'

import type { CookedTopics } from '../types/cookedcourse'

import catchAsync from '../utils/catchAsync'
import { PlaylistMaker } from '../utils/playlist-maker/PlaylistMaker'
import prisma from '../utils/prisma-client/getPrismaClient'

// AI-AGENT API Route
const AGENT_ROUTE = 'http://agent_container:8000/api/v1/agent'

const generateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1) GET Topics of SYLLABUS from AI-AGENT
    const extractedTopics: CookedTopics = (await axios.post(`${AGENT_ROUTE}/generate-topics`, {
        syllabus: req.body
    })).data

    const subject: string = req.body.subject;

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

export default { generateCourse, checkInDB }
