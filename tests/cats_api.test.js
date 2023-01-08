const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('returned response is json', async () => {
    await api
        .get('/api/cats')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
})

test('there are two cats', async () => {
    const response = await api.get('/api/cats')

    expect(response.body).toHaveLength(2)
})

test('the first cats name is mini', async () => {
    const response = await api.get('/api/cats')
    expect(response.body[0].name).toBe('mini')
})