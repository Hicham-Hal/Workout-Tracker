import express from 'express'
import { login, register, logout, refreshToken } from '../controllers/user.controller.js'
import { loginValidators, registerValidators } from '../validators/auth.validator.js'
import { validate } from '../validators/validate.js'

const route = express.Router()

route.post('/login', loginValidators, validate, login)
route.post('/register', registerValidators, validate, register)
route.post('/logout', logout)
route.post('/refresh-token', refreshToken)

export default route