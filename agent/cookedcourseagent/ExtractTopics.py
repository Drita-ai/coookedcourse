import requests


'''
    Abstract class to Extract Topics from syllabus
'''
class ExtractTopics:
    def extractTopics(self, syllabus):
        pass
    

class MockExtractTopics:
    _SOURCE_URLS = ["http://localhost:3000/Unit 1", 
                   "http://localhost:3000/Unit 2",
                   "http://localhost:3000/Unit 3",
                   "http://localhost:3000/Unit 4",
                   "http://localhost:3000/Unit 5"]
    
    def mockExtractTopics(self):
        mockTopicsResult = {}
        
        for i, url in enumerate(self._SOURCE_URLS):
            try:
                res = requests.get(url)
                mockTopicsResult[f'Unit {i + 1}'] = res.json()
            except Exception as e:
                print(e)
        
        return mockTopicsResult