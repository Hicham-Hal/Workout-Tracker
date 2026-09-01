import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'

configDotenv()

export async function verifyToken(req, res, next){
    try{
        const token = req.headers['authorization']?.split(' ')[1]
        if(!token) return res.status(401).json({ message: 'UnAuthorized' })
        const verify = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = verify
        next()
    }catch(err){
        console.log(err)
        return res.status(403).json({ error: 'Forbidden' })
    }
}