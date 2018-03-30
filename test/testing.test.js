const request = require('supertest')
const fs = require('fs')
const { app } = require('./../server')
const jwt = require('jsonwebtoken')
const path = require('path')
const { expect, assert, should } = require('chai')
const getPixels = require('get-pixels')

describe('Functional Test <Sessions>:', () => {
  it('should create user session for any user', done => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ username: 'user_test@example.com', password: '123' })
      .expect(200)
      .end(function(err, res) {
        expect(res.body.message).to.equal('Logged In')
        Cookies = res.headers['set-cookie'].pop().split(';')[0]
        done()
      })
  })
  it('should be an invalid login request', done => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ username: '', password: '123' })
      .expect(400)
      .end(function(err, res) {
        expect(res.body.message).to.equal('Bad Request')
        done()
      })
  })
  it('should get patched json back', done => {
    var req = request(app).post('/patchrequest')
    // Set cookie to get saved user session
    req.cookies = Cookies
    req
      .set('Accept', 'application/json')
      .send({
        obj: {
          foo: 'hehe',
          update: 'notdone'
        },
        patches: [
          { op: 'replace', path: '/foo', value: 'test' },
          { op: 'replace', path: '/update', value: 'done' }
        ]
      })
      .expect(200)
      .expect(res => {
        expect(res.body.foo).to.equal('test')
        expect(res.body.update).to.equal('done')
      })
      .end(done)
  })

  it('should get invalid patch request back as error', done => {
    var req = request(app).post('/patchrequest')
    // Set cookie to get saved user session
    req.cookies = Cookies
    req
      .set('Accept', 'application/json')
      .send({
        obj: {
          fooo: 'hehe',
          update: 'notdone'
        },
        patches: [
          { op: 'replace', path: '/foo', value: 'test' },
          { op: 'replace', path: '/update', value: 'done' }
        ]
      })
      .expect(400)
      .expect(res => {
        expect(res.body.error).to.equal('Invalid patch request!')
      })
      .end(done)
  })

  it('should response with a thimbnail image', done => {
    url =
      'https://www.google.co.in/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'

    var req = request(app).post('/thumbnail')
    // Set cookie to get saved user session
    req.cookies = Cookies
    req
      .set('Accept', 'application/json')
      .send({ url })
      .expect(200)
      .expect(res => {
        var data = res.body
        expect(Buffer.isBuffer(data)).to.be.true
        fs.writeFile('test/test.png', data, 'binary', function(err) {
          if (err) throw new Error(err)
        })
        getPixels('test/test.png', function(err, pixels) {
          if (err) {
            throw new Error(err)
          }
          expect(pixels.shape.slice()).to.deep.equal([50, 50, 4])
        })
      })
      .end(done)
  })

  it('should response 400 when invalid url', done => {
    url = ''

    var req = request(app).post('/thumbnail')
    // Set cookie to get saved user session
    req.cookies = Cookies
    req
      .set('Accept', 'application/json')
      .send({ url })
      .expect(400)
      .expect(res => {
        expect(res.body.message).to.equal('No image url found')
      })
      .end(done)
  })
})
