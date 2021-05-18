const Kandidat = require('./model')
const fs = require('fs')
const path = require('path')
const config = require('../config')
const { policyFor } = require('../policy')

async function index (req, res, next) {
  try {
    const policy = policyFor(req.user)
    const kandidat = await Kandidat.find()
    const count = await Kandidat.find().countDocuments()
    return res.json({
      data: kandidat,
      count
    })
  } catch (err) {
    next(err)
  }
}

async function store (req, res, next) {
  try {
    let payload = req.body
    if (req.file) {
      const tmpPath = req.file.path
      const originalExtension = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
      const filename = req.file.filename + '.' + originalExtension
      const targetPath = path.resolve(config.rootPath, `public/upload/${filename}`)
      const src = fs.createReadStream(tmpPath)
      const dest = fs.createWriteStream(targetPath)
      
      src.pipe(dest)
      src.on('end', async () => {
        try {
          const kandidat = new Kandidat({ ...payload, foto_kandidat: filename })
          await kandidat.save()
          return res.json(kandidat)
        } catch(err){
          if (err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            })
          }
        }
      })
      src.on('error', async (err) => {
        next(err)
      })
    } else {
    const kandidat = new Kandidat(payload)
      await kandidat.save()
      return res.json(kandidat)
   }
  } catch(err) {
    if (err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      })
    }
    next(err)
  }
}

async function destroy (req, res, next) {
  try {
    const kandidat = await Kandidat.findOne({ _id: req.params.id })
    if (kandidat) {
      const targetPath = path.resolve(config.rootPath, `public/upload/${kandidat.foto_kandidat}`)
      fs.unlinkSync(targetPath)
      const hapus = await Kandidat.findOneAndDelete({ _id: req.params.id})
      return res.json(hapus)
    }
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  index,
  store,
  destroy
}
