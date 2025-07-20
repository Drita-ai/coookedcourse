from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts.prompt import PromptTemplate
from dotenv import load_dotenv
import json

from .ExtractTopics import ExtractTopics, MockExtractTopics


_COOKED_COURSE_PROMPT_TEMPLATE = '''
You will be given {subject_syllabus} of any subject. 

You've to extract unit, unit name and all the sub topics given in the syllabus and provide the result 
as json, in this format:

{{
    "unit": {{
        "name": "unit name",
        "topics": [list of all sub topics]
    }}
}}

## Examples

For syllabus : Unit 1-Introduction: Basic Terminologies: Elementary Data Organizations, Data Structure Operations:
insertion, deletion, traversal etc.; Analysis of an Algorithm, Asymptotic Notations, Time-Space trade-off.
Searching: Linear Search and Binary Search Techniques and their complexity analysis.

{{
    "Unit 1":{{
        "name": "Introduction",
        "topics": ["Basic Terminologies: Elementary Data Organizations",and so on]
    }}
}}
'''

class CookedCourseAgent(ExtractTopics, MockExtractTopics):
    def __init__(self):
        load_dotenv()
        
    def extractTopics(self, syllabus):
        '''
            TODO: We'll pass SYLLABUS to LLM and it'll output the sub-topics
        '''
        
        # Create Topics Extraction Template
        course_topics_prompt_template = PromptTemplate(input_variables=["subject_syllabus"], template=_COOKED_COURSE_PROMPT_TEMPLATE)
        
        # Language Model
        llm = ChatGoogleGenerativeAI(temperature=0, model='gemini-1.5-pro')
        
        chain = course_topics_prompt_template | llm
        
        res = chain.invoke(input={"subject_syllabus": syllabus})
        
        return res