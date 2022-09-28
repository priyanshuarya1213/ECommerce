const User = require('../models/user-model')
const Jwt = require('jsonwebtoken')
var { expressjwt: jwt } = require('express-jwt')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.signup = (req, res) => {
  console.log('req.body is', req.body)
  const user = new User(req.body)
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      })
    }
    user.salt = undefined
    user.hashed_password = undefined
    res.json({
      user,
    })
  })
}

exports.signin = (req, res) => {
  const { email, password } = req.body
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email doesnot exist. Please signup',
      })
    }

    //create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password dont match',
      })
    }

    //generate a signed token with user id and secret
    const token = Jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    //persist the token as 't' in cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 })
    //return response with user and token to frontend client
    const { _id, name, email, role } = user
    return res.json({ token, user: { _id, email, name, role } })
  })
}

exports.signout = (req, res) => {
  res.clearCookie('t')
  res.json({ message: 'Signout success' })
}

exports.requireSignin = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
})

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id
  if (!user) {
    return res.status(403).json({
      error: 'Access Denied',
    })
  }
  next()
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access Denied',
    })
  }
  next()
}
