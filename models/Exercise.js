import mongoose from 'mongoose'

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    muscleGroup: { type: String },
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

export default Exercise