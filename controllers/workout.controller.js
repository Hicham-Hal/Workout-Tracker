import Plan from "../models/Plan.js"

export const addPlan = async(req, res)=>{
    const { title, time, exercises } = req.body
    if(!title || !time || !exercises){
        return res.status(400).json({ message: 'Fields are required' })
    }
    try{
        const date = new Date(time)
        const newPlan = new Plan({
            owner: req.user.id,
            title,
            exercises,
            scheduledAt: date,            
        })
        await newPlan.save()

        return res.status(201).json({ newPlan })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const updatePlan = async(req, res)=>{
    const {id} = req.params
    const { title, time, exercises } = req.body

    const date = time ? new Date(time) : null
    try{
        const plan = await Plan.findOne({ owner: req.user.id, _id: id })
        if(!plan) return res.status(404).json({ message: 'plan not found' })
        plan.title = title ? title : plan.title;
        plan.scheduledAt = date ? date : plan.scheduledAt
        plan.exercises = exercises ? exercises : plan.exercises
        if(!title && !time && !exercises) return res.status(200).json({ message: 'nothing modified' })
        await plan.save()
        return res.status(200).json({ plan })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const deletePlan = async(req, res)=>{
    const { id } = req.body
    if(!id) return res.status(401).json({ message: 'you should provide the plan id' })
    try{
        const plan = await Plan.findOne({ _id: id, owner: req.user.id })
        if(!plan) return res.status(404).json({ message: 'Plan not found' })
        await plan.deleteOne()
        return res.status(204).json()
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const addComment = async(req, res) => {
    const {id} = req.params
    const {commentObj} = req.body
    if(!commentObj.comment) return res.status(401).json({ message: 'You should provide a comment to submit' })
    try{
        const plan = await Plan.findOne({ _id: id, owner: req.user.id })
        if(!plan) return res.status(404).json({ message: 'Plan not found' })
        plan.comments = [...plan.comments, commentObj]
        await plan.save()
        return res.status(201).json({ comments: plan.comments })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const deleteComment = async(req, res) => {
    const {id} = req.body
    const {planId} = req.params
    try{
        const plan = await Plan.findOne({ _id: id, owner: req.user.id })
        if(!plan) return res.status(404).json({ message: 'plan not found' })
        const comment = plan.comments.find(c => c._id === id)
        if((req.user.id.toString() !== comment.author.toString()) && (req.user.id.toString() !== plan.owner.toString())) return res.status(403).json({ message: 'you can not delete user\' else comment' })
        plan.comments = plan.comments.filter(c => c._id.toString() !== comment._id.toString())
        await plan.save()
        return res.status(200).json({ plan })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const getPlans = async(req, res) => {
    const {state} = req.query;
    try{
        const plans = await Plan.find({ owner: req.user.id })
        if(!plans) return res.status(401).json({ message: 'can\'t get plans' })
        return res.status(200).json({ plans })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: "Something went wrong" })
    }
}