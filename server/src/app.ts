import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { router as generateCookedCourseRouter } from './routes/generateCourseRoutes'

const app = express()

if (process.env.NODE_ENV = 'development') app.use(morgan('dev'))

// CORS
app.use(cors())

// Essential Middlewares
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/v1/cookedcourse", generateCookedCourseRouter)

export default app;