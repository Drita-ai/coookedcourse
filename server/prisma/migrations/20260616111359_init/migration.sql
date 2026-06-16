-- CreateTable
CREATE TABLE "ChapterAnalysisFallback" (
    "id" TEXT NOT NULL,
    "topicName" TEXT NOT NULL,
    "ytVideoTitle" TEXT NOT NULL,
    "ytVideoId" TEXT NOT NULL,
    "chapterAnalysisId" TEXT NOT NULL,

    CONSTRAINT "ChapterAnalysisFallback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChapterAnalysisFallback" ADD CONSTRAINT "ChapterAnalysisFallback_chapterAnalysisId_fkey" FOREIGN KEY ("chapterAnalysisId") REFERENCES "ChapterAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
