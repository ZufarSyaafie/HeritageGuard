import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import healthRoutes from './routes/health.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

app.use('/health', healthRoutes)

export default app
