const expect = require('expect')
const request = require('supertest')
const { app } = require('./../server')

it('Should return an Logged In', done => {
  request(app)
    .post('/login')
    .send({ username: 's', password: 'd' })
    .expect(200)
    .end(done)
})
