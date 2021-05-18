const User = require('../user/model')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../config')
const { getToken } = require('../utils/get-token')

function me (req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: 'kamu belum login atau token expired'
    })
  }

  return res.json(req.user)
}

async function register (req, res, next) {
  try {
    const payload = req.body
    const user = new User(payload)
    await user.save()
    return res.json(user)
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      })
    }
    next(err)
  }
}

async function localStrategy (nim, password, done) {
  try {
    const user = await User
      .findOne({ nim })
      .select('-__v -createdAt -updatedAt -cart_items -token')

    if (!user) {
      return done()
    }
    if (bcrypt.compareSync(password, user.password)) {
      const { password, ...userWithoutPassword } = user.toJSON()
      return done(null, userWithoutPassword)
    }
  } catch (err) {
    done(err, null)
  }
  done()
}

async function localStrategyAdmin (username, password, done) {
  try {
    const user = await User
      .findOne({ username })
      .select('-__v -createdAt -updatedAt -cart_items -token')

    if (!user) {
      return done()
    }
    if (bcrypt.compareSync(password, user.password)) {
      const { password, ...userWithoutPassword } = user.toJSON()
      return done(null, userWithoutPassword)
    }
  } catch (err) {
    done(err, null)
  }
  done()
}

async function login (req, res, next) {
  passport.authenticate('local', async function (err, user) {
    if (err) return next(err)
    if (!user) {
      return res.json({
        error: 1,
        message: 'NIM atau password salah'
      })
    }

    const signed = jwt.sign(user, config.secretKey)
    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    )

    return res.json({
      message: 'login sukses',
      user: user,
      token: signed
    })
  })(req, res, next)
}

async function logout (req, res, next) {
  const token = getToken(req)
  //console.log(token)
  //console.log('uiiiiiiii')
  const user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: true }
  )

  if (!user || !token) {
    return res.json({
      error: 1,
      message: 'User tidak ditemukan'
    })
  }

  return res.json({
    error: 0,
    message: 'Berhasil logout'
  })
}

async function loginAdmin (req, res, next) {
  passport.authenticate('local-admin', async function (err, user) {
    if (err) return next(err)
    if (!user) {
      return res.json({
        error: 1,
        message: 'username atau password salah'
      })
    }

    const signed = jwt.sign(user, config.secretKey)
    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    )

    return res.json({
      message: 'login sukses',
      user: user,
      token: signed
    })
  })(req, res, next)
}

module.exports = {
  register,
  localStrategy,
  localStrategyAdmin,
  login,
  loginAdmin,
  me,
  logout
}
