import request from 'supertest'
import app from '../../app.js'
import { connectTestDb, clearTestDb, closeTestDb } from '../setup.js'
import { beforeAll, afterAll, afterEach, describe, expect, it } from 'vitest'
import { createUser } from '../helpers/helper.js'


beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)


describe('Post /register', () => {
    it('create a user successfully', async() => {
        const res = await request(app).post('/register').send({
            username: 'User1',
            email: 'user@gmail.com',
            password: 'user1234'
        })

        expect(res.status).toBe(201)
        expect(res.body.accessToken).toBeDefined()
    }),

    it('reject creating a user with invalid email', async() => {
        const res = await request(app).post('/register').send({
            username: 'User1',
            email: 'user1@',
            password: 'user1234'
        })

        expect(res.status).toBe(400)
    }),

    it('reject creating a user with invalid password', async() => {
        const res = await request(app).post('/register').send({
            username: 'user1',
            email: 'user@gmail.com',
            password: 'user'
        })

        expect(res.status).toBe(400)
    }),

    it('reject creating a user with existed email address', async() => {
        const user = await request(app).post('/register').send({
            username: 'user1',
            email: 'user1@gmail.com',
            password: 'user1'
        })

        const res = await request(app).post('/register').send({
            username: 'user2',
            email: 'user1@gmail.com',
            password: 'user2'
        })

        expect(res.status).toBe(400)
    })
})

describe('POST /login', () => {
    it('login successfully', async() => {
        const user = await createUser()
        const res = await request(app).post('/login').send({
            email: user.email,
            password: user.password
        })

        expect(res.status).toBe(200)
        expect(res.body.accessToken).toBeDefined()
    }),

    it('reject login with wrong credentials', async() => {
        const user = await createUser()

        const res = await request(app).post('/login').send({
            email: user.email,
            password: 'user123456'
        })

        expect(res.status).toBe(401)
    })

    it('reject login with non existing email', async() => {
        const res = await request(app).post('/login').send({
            email: 'user123@gmail.com',
            password: 'user1234'
        })

        expect(res.status).toBe(401)
    })
})

