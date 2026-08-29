import express from 'express'
import userRoute from './routes/user.route.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/', userRoute)

export default app