import express from 'express'

import generateCourseController from '../controllers/generateCourseController'
import authController from '../controllers/authController'

const router = express.Router();

router
    .route('/generate-course')
    .post(authController.protect, generateCourseController.generateCourse)


export { router }