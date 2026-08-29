import { configDotenv } from 'dotenv'
import { connectDB } from './lib/connectDB.js'
import app from './app.js'

configDotenv()

const PORT = process.env.PORT || 3000



connectDB()

app.listen(PORT, () => {
    console.log(`The server is running on PORT: ${PORT}`)
})