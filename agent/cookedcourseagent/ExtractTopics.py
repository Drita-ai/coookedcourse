from langchain.prompts.prompt import PromptTemplate
import requests
import json
import re

_COOKED_COURSE_PROMPT_TEMPLATE = """
You are given a subject syllabus in JSON format. Your task is to extract and restructure it into a well-structured JSON with Units, their main sections, and topics.

### Input Syllabus:
{subject_syllabus}

### Instructions:
1. Output **ONLY** valid JSON.
2. For each Unit, identify the **main section names** (e.g., "Introduction", "Stacks and Queues", "Sorting and Hashing", "Hashing").
3. Under each section, list all **topics as an array of strings**.
4. If multiple sections exist inside the same unit, represent each as a separate object in a list.
5. Do NOT include explanations, extra text, or code fences.
6. Ensure the final JSON follows exactly this schema and nothing else:
   {{
       "UnitX": [
           {{
               "name": "<Section Name>",
               "topics": ["<topic1>", "<topic2>", ...]
           }}
       ]
   }}
"""
class ExtractTopics:
    """
    This class is responsible for extracting topics from a syllabus using a provided LLM.
    """
    def __init__(self, llm, syllabus):
        if llm is None:
            raise ValueError("An LLM instance must be provided.")
        self.llm = llm
        self.syllabus = syllabus

    def extractTopics(self):
        """
        Passes the syllabus to the LLM to extract units and sub-topics.
        """
        
        course_topics_prompt_template = PromptTemplate(
            input_variables=["subject_syllabus"], 
            template=_COOKED_COURSE_PROMPT_TEMPLATE
        )
        
        chain = course_topics_prompt_template | self.llm
        
        res = chain.invoke(input={"subject_syllabus": self.syllabus})

        text_output = res.content if hasattr(res, "content") else str(res)

        # Clean out markdown fences if model added them
        clean_text = re.sub(r"```json|```", "", text_output).strip()

        try:
            return json.loads(clean_text)  
        except json.JSONDecodeError:
            raise ValueError("LLM did not return valid JSON:\n" + clean_text)

class MockExtractTopics:
    """
    This class provides a mock implementation for topic extraction, fetching data from predefined URLs.
    """
    _SOURCE_URLS = ["http://host.docker.internal:3000/Unit 1", 
                   "http://host.docker.internal:3000/Unit 2",
                   "http://host.docker.internal:3000/Unit 3",
                   "http://host.docker.internal:3000/Unit 4",
                   "http://host.docker.internal:3000/Unit 5"]
    
    def mockExtractTopics(self):
        """
        Fetches mock topic data from a list of source URLs.
        """
        mockTopicsResult = {}
        
        for i, url in enumerate(self._SOURCE_URLS):
            try:
                res = requests.get(url)
                res.raise_for_status() 
                mockTopicsResult[f'Unit {i + 1}'] = res.json()
            except requests.exceptions.RequestException as e:
                print(f"Error fetching mock data from {url}: {e}")
        
        return mockTopicsResult
