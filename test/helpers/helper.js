import request from 'supertest'
import app from '../../app.js'

let counter = 0

export const createUser = async(override = {}) => {
    counter++

    const payload = {
        name: `User ${counter}`,
        email: `user${counter}@gmail.com`,
        password: '1234user',
        ...override
    }

    const res = await request(app).post('/register').send(payload)

    return {
        token: res.body.accessToken,
        user: payload.name,
        rawResponse: res
    }
}