import express from 'express'

import generateCourseController from '../controllers/generateCourseController'

const router = express.Router();

router
    .route('/generate-course')
    .post(generateCourseController.generateCourse)


export { router }