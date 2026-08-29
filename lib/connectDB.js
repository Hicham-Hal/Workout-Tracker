import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv()

export async function connectDB(){
    const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.2thzjhk.mongodb.net/?appName=Cluster0`
    try{
        await mongoose.connect(URI)
        console.log('Db connected')
    }catch(err){
        console.log(`Database connection error: ${err}`)
    }
}