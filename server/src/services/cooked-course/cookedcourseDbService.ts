import prisma from '../../utils/prisma-client/getPrismaClient'

export const saveTopicsToDB = async (toExtractTopicsOfChapters, newExtractedTopics) => {
  toExtractTopicsOfChapters.map(async (topic, i) => {
    // Get the chapter, if it exists
    const searchedChapter = await prisma.chapter.findFirst({
      where: {
        chapterData: topic,
      },
    });

    // Get relevant extracted topics of the searchedChapter
    const extractedTopics = newExtractedTopics
      .filter((topic) => Number(topic.unit - 1) === i)
      .map(({ unit, ...rest }) => rest);

    if (!searchedChapter) {
      await prisma.chapter.createMany({
        data: {
          chapterData: topic,
          ...extractedTopics[i]
        }
      });
    } else {
      if (i == 0) await prisma.chapter.update({ where: { id: searchedChapter.id }, data: extractedTopics[i] });
      else await prisma.chapter.create({
        data: {
          chapterData: topic,
          ...extractedTopics[i]
        }
      })
    }
  })
}