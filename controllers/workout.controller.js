import Plan from "../models/Plan.js"

export const addPlan = async(req, res)=>{
    const { title, time, exercises } = req.body
    if(!title || !time || !exercises){
        return res.status(400).json({ message: 'Fields are required' })
    }
    try{
        const date = new Date(time)
        const newPlan = new Plan({
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
        const plan = await Plan.findById(id)
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
        const plan = await Plan.findById(id)
        if(!plan) return res.status(404).json({ message: 'Plan not found' })
        await plan.deleteOne()
        return res.status(204).json()
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}