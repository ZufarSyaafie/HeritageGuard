import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import healthRoutes from './routes/health.js'
import inferenceRoutes from './routes/inference.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

app.use('/health', healthRoutes)
app.use('/api/inference', inferenceRoutes)

app.use((error, req, res, next) => {
	if (error?.name === 'MulterError') {
		return res.status(400).json({
			error: error.message,
		})
	}

	console.error(error)

	return res.status(500).json({
		error: error?.message || 'Internal server error',
	})
})

export default app
