const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { userLogin, authenticateUser, getpatch } = require('./services')
const jsonpatch = require('jsonpatch')
const fs = require('fs')
const request = require('request')
const sharp = require('sharp')

const download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body) {
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on('close', callback)
  })
}

var app = express()

app.use(bodyParser.json())
app.use(cookieParser())

app.post('/login', userLogin, (req, res) => {
  res
    .header('auth', req.token)
    .cookie('auth', req.token)
    .status(200)
    .send({ message: 'Logged In' })
})

app.post('/patchrequest', authenticateUser, (req, res) => {
  const { obj, patches } = req.body
  if (obj && patches) {
    try {
      result = jsonpatch.apply_patch(obj, patches)
      res.json(result)
    } catch (e) {
      res.status(400).send({ error: 'Invalid patch request!' })
    }
  }
})

app.post('/thumbnail', authenticateUser, (req, res) => {
  url = req.body.url
  if (url) {
    download(url, 'original.png', function() {
      sharp(__dirname + '/original.png')
        .resize(50, 50)
        .toFile('output.png', (err, info) => {
          res.sendFile(__dirname + '/output.png')
        })
    })
  } else {
    res.status(400).send({ message: 'No image url found' })
  }
})

app.listen(8000, err => {
  if (err) return console.log(err)
  console.log('Running!')
})

module.exports = { app }
