import express from 'express'
import { configDotenv } from 'dotenv'
import { connectDB } from './lib/connectDB.js'

configDotenv()

const PORT = process.env.PORT || 3000

const app = express()


connectDB()

app.listen(PORT, () => {
    console.log(`The server is running on PORT: ${PORT}`)
})