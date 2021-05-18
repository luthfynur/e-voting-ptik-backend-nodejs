const router = require('express').Router()
const multer = require('multer')
const userController = require('./controller')

router.get('/users', userController.index)
router.delete('/users/:id', userController.destroy)
router.put('/users/:id', multer().none(), userController.update)

module.exports = router