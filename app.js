import express from 'express'
import userRoute from './routes/user.route.js'
import cookieParser from 'cookie-parser'
import planRoute from './routes/workout.route.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/', userRoute)
app.use('/plan', planRoute)

export default app