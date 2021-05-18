const router = require('express').Router()
const kandidatController = require('./controller')
const multer = require('multer')
const os = require('os')

router.get('/kandidat', kandidatController.index)
router.delete('/kandidat/:id', kandidatController.destroy)
router.post('/kandidat', multer({ dest: os.tmpdir() }).single('foto_kandidat'), kandidatController.store)
module.exports = router
