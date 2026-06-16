-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "channelName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "matchedSyllabusTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "matchedYoutubeTitles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "unmatchedSyllabusTopics" TEXT[] DEFAULT ARRAY[]::TEXT[];
