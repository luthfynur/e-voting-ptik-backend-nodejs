const router = require('express').Router()
const multer = require('multer')
const voteController = require('./controller')

router.get('/vote', voteController.index)
router.delete('/vote/:id', voteController.destroy)
router.post('/vote', multer().none(), voteController.store)
router.put('/vote/:id', multer().none(), voteController.update)

module.exports = router