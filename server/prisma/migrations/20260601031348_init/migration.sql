/*
  Warnings:

  - You are about to drop the column `channelName` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `matchedSyllabusTopics` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `matchedYoutubeTitles` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `unmatchedSyllabusTopics` on the `Chapter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "channelName",
DROP COLUMN "matchedSyllabusTopics",
DROP COLUMN "matchedYoutubeTitles",
DROP COLUMN "unmatchedSyllabusTopics";

-- CreateTable
CREATE TABLE "ChapterAnalysis" (
    "id" TEXT NOT NULL,
    "channelName" TEXT NOT NULL DEFAULT '',
    "matchedSyllabusTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unmatchedSyllabusTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "unitCoveragePercentage" DOUBLE PRECISION NOT NULL,
    "chapterId" TEXT NOT NULL,

    CONSTRAINT "ChapterAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchedYoutubeTitle" (
    "id" TEXT NOT NULL,
    "ytVideoTitle" TEXT NOT NULL,
    "ytVideoId" TEXT NOT NULL,
    "chapterAnalysisId" TEXT NOT NULL,

    CONSTRAINT "MatchedYoutubeTitle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChapterAnalysis" ADD CONSTRAINT "ChapterAnalysis_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchedYoutubeTitle" ADD CONSTRAINT "MatchedYoutubeTitle_chapterAnalysisId_fkey" FOREIGN KEY ("chapterAnalysisId") REFERENCES "ChapterAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
