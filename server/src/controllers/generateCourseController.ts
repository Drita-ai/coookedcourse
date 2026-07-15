import { NextFunction, Request, Response } from 'express'

import catchAsync from '../utils/catchAsync'
import prisma from '../utils/prisma-client/getPrismaClient'
import { createCourse } from '../services/cooked-course/generateCourseService'


const generateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { navChapters, uniqueChannels, analysisMap } = await createCourse(
        req.__to_extract_topics_of_chapters,
        req.__to_analyze_chapters,
        req.__already_extracted_chapters,
        req._cooked_client,
        req.body.subject,
        req.query
    );

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
        await prisma.user.create({
            data: {
                clientId
            }
        })
    }

    const alreadyExtractedChapters: string[] = [];
    const toExtractTopicsOfChapters: string[] = [];
    const toAnalyzeChapters: string[] = [];

    // Check for already created course based on the syllabus
    await Promise.all((Object.entries(syllabus)).map(async (el, i) => {
        // Find the Chapter
        const searchedChapter = await prisma.chapter.findFirst({
            where: {
                chapterData: el[1]!,
            },
            include: {
                chapterAnalysis: true
            }
        });

        // If Chapter doesn't exist
        if (!searchedChapter) toExtractTopicsOfChapters.push(el[1]);

        // If Chapter's analysis doesn't exist
        else if (searchedChapter.chapterAnalysis.length > 0) alreadyExtractedChapters.push(el[1]);

        // If Chapter's topics exist
        else if (searchedChapter.topics.length > 0) toAnalyzeChapters.push(el[1]);

        // If Chapter exists, but no topics or analysis
        else toExtractTopicsOfChapters.push(el[1]);
    }))

    req.__already_extracted_chapters = alreadyExtractedChapters;
    req.__to_extract_topics_of_chapters = toExtractTopicsOfChapters;
    req.__to_analyze_chapters = toAnalyzeChapters;

    next();
})

export default { generateCourse, checkInDB }
