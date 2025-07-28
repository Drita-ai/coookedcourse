import json
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel 
from pathlib import Path

from cookedcourseagent.CookedCourseAgent import CookedCourseAgent


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
        
        cookedTopics = CookedCourseAgent().mockExtractTopics()
        return cookedTopics
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")

@app.post("/api/v1/agent/analyze-topics/")
async def analyze_topics(payload: YTAndSyllabusTopics):
    try:
        # Construct a path to the JSON file relative to the script's location.
        current_file_path = Path(__file__)
        project_root = current_file_path.parent.parent
        file_path = project_root / "dev-data" / "analyzed-topics.json"

        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"File not found at the expected path: {file_path}"
            )

        with open(file_path, "r", encoding="utf-8") as f:
            analyzed_data = json.load(f)
        
        if not isinstance(analyzed_data, dict):
            raise HTTPException(
                status_code=500,
                detail="Invalid data format: root of analyzed-topics.json should be a dictionary."
            )

        # --- FIX: Store and re-add "unmatchedYoutubeTopics" to each item ---

        # Pop the general unmatched topics to store them separately.
        unmatched_topics = analyzed_data.pop("unmatchedYoutubeTopics", {})
        
        # Find the first channel key in the file to use as the template key
        # (e.g., "Gate Smashers")
        template_key = next((key for key in analyzed_data), None)

        if not template_key:
            raise HTTPException(
                status_code=500,
                detail="Invalid data format: No channel data found in the JSON file to use as a template."
            )
            
        # This is the data that will be reused for every channel in the payload
        template_data = analyzed_data[template_key]
        
        payload_channel_names = list(payload.channel_topics.keys())
        new_response_data = []
        
        # Iterate through the channel names from the payload
        for new_channel_name in payload_channel_names:
            # Create a new dictionary for each channel using the template data
            # and add the unmatched topics back in.
            new_item = {
                new_channel_name: template_data,
                "unmatchedYoutubeTopics": unmatched_topics
            }
            new_response_data.append(new_item)

        return new_response_data

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to decode JSON from the file. Please check the file format."
        )
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred. Please check the logs."
        )

