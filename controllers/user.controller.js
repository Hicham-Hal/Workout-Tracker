import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv"

configDotenv()

export const login = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password) return res.status(400).json({ message: 'fields are required' })
    try{
        const user = await User.findOne({ email })
        if(!user) return res.status(401).json({ message: 'No existing user with this email' })
        const verifyPwd = await bcrypt.compare(password, user.password)
        if(!verifyPwd) return res.status(401).json({ message: 'Wrong credentials, please try again' })
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        })

        return res.status(200).json({ message: `welcome ${user.username}`, accessToken })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const register = async(req, res) => {
    const salt = await bcrypt.genSalt(10)
    const { username, email, password } = req.body
    if(!email || !password || !username) return res.status(400).json({ message: 'fields are required' })
    try{
        const existUser = await User.findOne({ email })
        if(existUser) return res.status(400).json({ message: 'User alredy exist with that email' })
        const hashedPwd = await bcrypt.hash(password, salt)
        const user = new User({
            username,
            email,
            password: hashedPwd
        })

        await user.save()
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        })

        return res.status(201).json({ message: `Account for ${user.username} and with ${user.email} was created successfully`, accessToken })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const logout = async(req, res) => {
    try{
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        return res.status(200).json({ message: 'Logged out successfully' })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}