const mongoose = require('mongoose')

const { model, Schema } = mongoose
const voteSchema = Schema({
  tahun: {
    type: String,
    minlength: [4, 'Tahun minimal 4 digit'],
    required: [true, 'Tahun harus diisi']
  },
  kandidat1: {
    type: Schema.Types.ObjectId,
    ref: 'Kandidat'
  },
  kandidat2: {
    type: Schema.Types.ObjectId,
    ref: 'Kandidat'
  },
  voter1: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  voter2: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  votedUser: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['berlangsung', 'selesai'],
    default: 'selesai'
  },
  tampil: {
    type :String,
    enum: ['ya', 'tidak'],
    default: 'tidak'
  }
}, { timestamps: true })

module.exports = model('Vote', voteSchema)
