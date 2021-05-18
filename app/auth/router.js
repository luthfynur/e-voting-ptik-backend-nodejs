const router = require('express').Router()
const multer = require('multer')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const LocalStrategyAdmin = require('passport-local').Strategy
const controller = require('./controller')
passport.use('local-admin', new LocalStrategyAdmin({ usernameField: 'username' }, controller.localStrategyAdmin))
passport.use('local', new LocalStrategy({ usernameField: 'nim' }, controller.localStrategy))

router.post('/login', multer().none(), controller.login)
router.post('/login-admin', multer().none(), controller.loginAdmin)
router.post('/register', multer().none(), controller.register)
router.get('/me', controller.me)
router.post('/logout', controller.logout)

module.exports = router
