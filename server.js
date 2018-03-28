const express = require('express')

var app = express()

app.get('/', (req,res) => {
    res.send('hello')
})

app.post('/login', (req, res) => {
    // things goes here
})

app.listen(8000, (err) => {
    if (err)
        return console.log(err)
    console.log('Running!');
})