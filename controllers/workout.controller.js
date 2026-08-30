export const addPlan = async(req, res)=>{
    const { title, time, exercises } = req.body
    if(!title || !time || !exercises){
        return res.status(400).json({ message: 'Fields are required' })
    }
    try{

    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const updatePlan = async(req, res)=>{
    try{

    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const deletePlan = async(req, res)=>{
    try{

    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}