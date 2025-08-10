import axios from 'axios'

const BASE_URL = 'http://localhost:3300'

const apiClient = axios.create({
    baseURL: `${BASE_URL}/api/v1/cookedcourse`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

export const generateCourse = async (courseData) => {
    try {
        const response = await apiClient.post('/generate-course', courseData);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
            throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
            console.error("Network Error:", error.request);
            throw new Error("Cannot connect to the server. Please check your network connection and try again.");
        } else {
            console.error("Request Setup Error:", error);
            throw new Error("An unexpected error occurred while sending your request.");
        }
    }
}