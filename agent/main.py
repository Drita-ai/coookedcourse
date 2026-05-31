from pathlib import Path
import json
import re
import time

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel 
from langchain.prompts.prompt import PromptTemplate
from langchain.chat_models import init_chat_model

from cookedcourseagent.CookedCourseAgent import CookedCourseAgent
from prompts import SYLLABUS_ANALYSIS_PROMPT


# Max Playlists to Consider 
MAX_PLAYLISTS_TO_ITERATE = 1

app = FastAPI()

class Syllabus(BaseModel):
    syllabus: dict

class YTAndSyllabusTopics(BaseModel):
    syllabus_topics: dict
    channel_topics: dict
    
@app.post("/api/v1/agent/generate-topics/")
async def generate_topics(syll: Syllabus):
    try:
        '''
            TODO: Here we'll have to implement passing of syllabus to constructor
                  for further processing using LLM 
        '''

        cookedTopics = CookedCourseAgent(syll).extractTopics()
        return cookedTopics
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")

@app.post("/api/v1/agent/analyze-topics/")
async def analyze_topics(payload: YTAndSyllabusTopics):
    try:
        syllabus_topics = payload.syllabus_topics
        channel_topics = payload.channel_topics
        
        llm = init_chat_model(
            "llama-3.3-70b-versatile",
            model_provider="groq",
        )
        
        combined_syllabus = []
        
        # Iterate over syllabus topics
        for _, syllabus_topic  in syllabus_topics.items():
            for topic in syllabus_topic:
                combined_syllabus.append({
                    "name": topic['name'],
                    "topics": topic['topics']
                })
        
        aggregated_llm_res = []
        
        # Iterate over Playlists
        for channel_name, video_titles in list(channel_topics.items())[:MAX_PLAYLISTS_TO_ITERATE]:
            course_topics_prompt_template = PromptTemplate(
                input_variables=["syllabus_units", "playlist_video_titles"], 
                template=SYLLABUS_ANALYSIS_PROMPT
            )
        
            chain = course_topics_prompt_template | llm
        
            res = chain.invoke(
                input={
                    "syllabus_units": combined_syllabus, 
                    "playlist_video_titles": video_titles
                })

            text_output = res.content if hasattr(res, "content") else str(res)

            clean_text = re.sub(r"```json|```", "", text_output).strip()
            
            aggregated_llm_res.append({
                "channelName": channel_name,
                "analyzedPlaylistData": json.loads(clean_text)
            })
            
            time.sleep(3)
        
        return aggregated_llm_res
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred. Please check the logs."
        )

