import axios from 'axios';
import prisma from '../../utils/prisma-client/getPrismaClient';

// AI-AGENT API Route
const AGENT_ROUTE = 'http://agent_container:8000/api/v1/agent'

export const extractSyllabusTopics = async (toExtractChapters) => {
  try {
    let extractedTopics = (await axios.post(`${AGENT_ROUTE}/generate-topics`, {
      syllabus: toExtractChapters
    })).data

    return extractedTopics;
  } catch (err) {
    console.error(err)
  }
}