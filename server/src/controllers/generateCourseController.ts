import { NextFunction, Request, Response } from 'express'
import axios from 'axios'

import type { CookedTopics } from '../types/cookedcourse'

import catchAsync from '../utils/catchAsync'
import { PlaylistMaker } from '../utils/playlist-maker/PlaylistMaker'

// AI-AGENT API Route
const AGENT_ROUTE = 'http://localhost:8000/api/v1/agent'

const generateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1) GET Topics of SYLLABUS from AI-AGENT
    const extractedTopics: CookedTopics = (await axios.post(`${AGENT_ROUTE}/generate-topics`, {
        syllabus: req.body
    })).data

    const subject: string = req.body.subject;

    // 2) GET Playlists List
    const pm = new PlaylistMaker(extractedTopics, subject);
    const searchedPlaylists = await pm.fetchPlaylistVideos()

    console.log(searchedPlaylists)

    res.status(200).json({ "message": "success" })
})

export default { generateCourse }
