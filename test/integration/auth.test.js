import request from 'supertest'
import app from '../../app.js'
import { connectTestDb, clearTestDb, closeTestDb } from '../setup.js'
import { beforeAll, afterAll, afterEach, describe, expect } from 'vitest'


beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)


describe('Post /register', () => {
    it('create a user successfully', async() => {
        const res = await request(app).post('/register').send({
            name: 'User1',
            email: 'user@gmail.com',
            password: 'user1234'
        })

        expect(res.status).toBe(200)
        expect(res.body.accessToken).toBeDefined()
    })
})

