from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

from .ExtractTopics import ExtractTopics, MockExtractTopics

class CookedCourseAgent(ExtractTopics, MockExtractTopics):
    """
    An agent that can extract course topics from a syllabus using an LLM.
    """
    
    def __init__(self, syllabus):
        load_dotenv()
        
        llm = init_chat_model("llama-3.3-70b-versatile", model_provider="groq")
        
        ExtractTopics.__init__(self, llm, syllabus)

