import mongoose from "mongoose";
import Exercise from "../models/Exercise.js";
import fs from 'fs/promises'
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { configDotenv } from "dotenv";

configDotenv()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const exercises = await fs.readFile(path.join(__dirname, 'exercises.json'), 'utf8')
const exercisesData = JSON.parse(exercises)

async function seedExercises() {
    const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2thzjhk.mongodb.net/?appName=Cluster0`
    try{
        await mongoose.connect(URI)
        console.log('Connected to MongoDB')

        await Exercise.deleteMany()
        console.log('Cleared existing exercices')

        const inserted = await Exercise.insertMany(exercisesData)
        console.log(`Inserted ${exercisesData.length} exercises`)

        await mongoose.disconnect()
        console.log(`Disconnected from MongoDB`)
        process.exit(0)
    }catch(err){
        console.error(`Error seeding exercices: ${err}`)
        process.exit(1)
    }
}

seedExercises()