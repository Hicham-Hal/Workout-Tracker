import mongoose from 'mongoose'


const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String , required: true}
}, {timestamps: true})


const planSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        required: true,
        default: 'pending'
    },
    exercises: [{
        exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
        weight: { type: Number }
    }],
    scheduledAt: { type: Date, required: true },
    comments: [commentSchema]

}, { timestamps: true })

const Plan = mongoose.model('Plan', planSchema)

export default Plan