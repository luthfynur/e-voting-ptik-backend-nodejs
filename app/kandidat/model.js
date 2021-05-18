const mongoose = require('mongoose')

const { model, Schema } = mongoose
const kandidatSchema = Schema({
  nama: {
    type: String,
    minlength: [3, 'Nama minimal 3 karakter'],
    maxlength: [255, 'Nama maksimal 255 karakter'],
    required: [true, 'Nama harus diisi']
  },
  angkatan: {
    type: String,
    minlength: [4, 'Angkatan minimal 4 digit'],
    required: [true, 'Angkatan harus diisi']
  },

  foto_kandidat: {
    type: String,
    required: [true, 'Foto kandidatnya mana?']
  },
  visi: {
    type: String,
    minlength: [3, 'Visi minimal 3 karakter'],
    maxlength: [255, 'Visi maksimal 255 karakter'],
    required: [true, 'Visi harus diisi']
  },
  misi: {
    type: String,
    minlength: [3, 'Misi minimal 3 karakter'],
    maxlength: [255, 'Misi maksimal 255 karakter'],
    required: [true, 'Misi harus diisi']
  }
}, { timestamps: true })

module.exports = model('Kandidat', kandidatSchema)
