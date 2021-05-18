const User = require('./model')
const { policyFor } = require('../policy')
const bcrypt = require('bcrypt')
const HASH_ROUND = 10

async function index (req, res, next) {
  try {
    const users = await User
      .find({ role: 'user' })
      .sort({angkatan: 1, nim: 1})
      .select('-token -password -createdAt -updatedAt -__v')
    
    const count = await User.find({role: 'user'}).countDocuments()
    
    return res.json({
      data: users,
      count
    })
    
    
  } catch (err) {
    next(err)
  }
}

async function destroy (req, res, next) {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id })
    if (user) {
      return res.json(user)
    }
    next()
  } catch (err) {
    next(err)
  }
}

async function update (req, res, next) {
  try {
    let payload = req.body

    let user = await User.findOne({_id: req.params.id})
    const isMatch = await user.matchPassword(req.body.password)
    if (!isMatch) {
      return res.json({
        error: 1,
        message: 'Password lama anda salah'
      })
    }

    payload.new_password = bcrypt.hashSync(payload.new_password, HASH_ROUND)
    user = await User.findOneAndUpdate(
      { _id: req.params.id }, { password: payload.new_password }, {new:true, runValidators: true })
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

module.exports = {
  index,
  destroy,
  update,
}