const mongoose = require('mongoose')
const { model, Schema } = mongoose
const bcrypt = require('bcrypt')
const HASH_ROUND = 10
const autoIncrement = require('mongoose-sequence')(mongoose)
const validator = require('validator')
let defaultPassword = ''

const userSchema = Schema({
  full_name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    maxlength: [255, 'Nama lo kepanjangan'],
    minlength: [3, 'Nama lo kependekan']
  },
  student_id: {
    type: Number
  },
  nim: {
    type: String,
    required: [true, 'NIM harus diisi'],
    maxlength: [10, 'NIM lo kepanjangan'],
    minlength: [10, 'NIM lo kependekan']
  },
  angkatan: {
    type: Number,
    required: [true, 'Angkatan harus diisi'],
    min: [2013, 'Masukkan angkatan dengan benar'],
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    maxlength: [255, 'Email lo kepanjangan'],
    validate: {
      validator: validator.isEmail,
      message: 'Ini bukan email',
      isAsync: false
    }
  },
  password: {
    type: String,
    required: [true, 'Password lo mana'],
    minlength: [8, 'Password lo kependekan'],
    default: function() {return bcrypt.hashSync(this.nim, HASH_ROUND)}
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  token: [String]
}, { timestamps: true })

// userSchema.path('email').validate(function (value) {
//   const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
//   return EMAIL_RE.test(value)
// }, attr => `${attr.value} harus merupakan email yang valid!`)

userSchema.path('nim').validate(async function (value) {
  try {
    const count = await this.model('User').count({ nim: value })
    return !count
  } catch (err) {
    return err
  }
}, attr => `${attr.value} sudah terdaftar`)

userSchema.pre('save', function (next) {
  if(!this.password) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
  }
  next()
})

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.plugin(autoIncrement, { inc_field: 'student_id' })

module.exports = model('User', userSchema)
