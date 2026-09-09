import request from 'supertest'
import app from '../../app.js'
import Exercise from '../../models/Exercise.js'

let counter = 0

export const createUser = async(override = {}) => {
    counter++

    const payload = {
        username: `User ${counter}`,
        email: `user${counter}@gmail.com`,
        password: '1234user',
        ...override
    }

    const res = await request(app).post('/register').send(payload)

    return {
        token: res.body.accessToken,
        email: payload.email,
        password: payload.password,
        name: payload.name,
        rawResponse: res
    }
}


export const createPlan = async(token, rep, override = {}) => {
    const payload = {
        title: `plan`,
        time: '2026-09-01T15:31:18.554+00:00',
        exercises: [
            {
                exercise: "6a9301c9240168ffc1e5a7a9",
                sets: 3,
                reps: 12,
                weight: 40
            },
            {
                exercise: "6a9301c9240168ffc1e5a7a9",
                sets: 2,
                reps: 12,
                weight: 30
            },        
        ],
        ...override
    }
    let res;
    for(let i = 0; i < rep; i++){
        res = await request(app).post('/plan/add').set('Authorization', `Bearer ${token}`).send(payload)
    }

    return res.body.newPlan
}