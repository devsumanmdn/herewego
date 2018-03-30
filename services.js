const jwt = require('jsonwebtoken')

module.exports = {
  userLogin: async (req, res, next) => {
    const { username, password } = req.body
    if (username && password) {
      var token = jwt.sign({ user: username }, 'abc123secret').toString()
      req.token = token
      next()
    } else res.status(400).send({ message: 'Bad Request' })
  },
  authenticateUser: async (req, res, next) => {
    var token = req.cookies.auth
    if (token) {
      jwt.verify(token, 'abc123secret', err => {
        if (err) return res.status(300).send('Unauthorised')
        next()
      })
    } else {
      res.status(401).send('Unauthorized')
    }
  }
}
