from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel 

from cookedcourseagent.CookedCourseAgent import CookedCourseAgent


app = FastAPI()

class Syllabus(BaseModel):
    syllabus: dict
    
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