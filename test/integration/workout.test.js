import request from 'supertest'
import app from '../../app.js'
import { connectTestDb, clearTestDb, closeTestDb } from '../setup.js'
import { beforeAll, afterEach, afterAll, describe, expect, it } from 'vitest'
import { createPlan, createUser } from '../helpers/helper.js'
import Plan from '../../models/Plan.js'


beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)

describe('POST /add plan', () => {
    it('added a plan successfully', async() => {
        const user = await createUser()
        const res = await request(app).post('/plan/add').set('Authorization', `Bearer ${user.token}`).send({
            title: "chest day",
            time: "2026-09-01T15:31:18.554+00:00",
            exercises: [
                {
                    exercise: "6a9301c9240168ffc1e5a7a9",
                    sets: 3,
                    reps: 12,
                    weight: 60
                },
                {
                    exercise: "6a9301c9240168ffc1e5a7a9",
                    sets: 3,
                    reps: 8,
                    weight: 75
                }
            ]
        })

        expect(res.status).toBe(201)
        expect(res.body.newPlan).toBeDefined()
    })
})


describe('PUT /update plan', () => {
    it('update a plan successfully', async() => {
        const user = await createUser()
        const plan = await createPlan(user.token, 1)
        const res = await request(app).put(`/plan/update/${plan._id}`).set('Authorization', `Bearer ${user.token}`).send({
            title: 'back'
        })
        expect(res.status).toBe(200)
        expect(res.body.plan.title).toBe('back')
    })
})


describe('Delete /delete plan', () => {
    it('delete successfully a plan', async() => {
        const user = await createUser()
        const plan = await createPlan(user.token, 1)

        const res = await request(app).delete('/plan/delete').set('Authorization', `Bearer ${user.token}`).send({
            id: plan._id
        })
        expect(res.status).toBe(204)
    })

})

describe('POST /add comment', () => {
    it('adding a comment successfully', async() => {
        const user = await createUser()
        const plan = await createPlan(user.token, 1)

        const res = await request(app).post(`/plan/${plan._id}`).set('Authorization', `Bearer ${user.token}`).send({
            commentObj: {
                comment: 'i\'ll try'
            }
        })

        expect(res.status).toBe(201)
        expect(res.body.comments).toBeDefined()
    })
})


describe('DELETE /delete comment', () => {
    it('delete a comment successfully', async() => {
        const user = await createUser()
        const plan = await createPlan(user.token, 1)

        const addComment = await request(app).post(`/plan/${plan._id}`).set('Authorization', `Bearer ${user.token}`).send({
            commentObj: {
                comment: 'i\'ll try'
            }
        })
        const res = await request(app).delete(`/plan/${plan._id}`).set('Authorization', `Bearer ${user.token}`).send({
            id: addComment.body.comments[0]._id
        })
        console.log(res.body)
        expect(res.status).toBe(204)
        expect(res.body.plan).toBeUndefined()
    })
})

describe('GET /get plans', () => {
    it('gets all plans successfully', async() => {
        const user = await createUser()
        const plans = await createPlan(user.token, 4)

        const res = await request(app).get('/plan').set('Authorization', `Bearer ${user.token}`)
        expect(res.status).toBe(200)
        expect(res.body.plans.length).toBe(4)
    })
})

describe('PUT /update status', () => {
    it('update status successfully', async() => {
        const user = await createUser()
        const plan = await createPlan(user.token, 1)

        const res = await request(app).put(`/plan/${plan._id}/status`).set('Authorization', `Bearer ${user.token}`).send({
            status: 'completed'
        })

        expect(res.status).toBe(200)
        expect(res.body.plan).toBeDefined()
    })

    it('reject updating status if it is not one of pending, active, completed', async() => {
        const user = await createUser()
        const plan = await createPlan(user.token, 1)

        const res = await request(app).put(`/plan/${plan._id}/status`).set('Authorization', `Bearer ${user.token}`).send({
            status: 'ok'
        })

        expect(res.status).toBe(400)
    })
})

