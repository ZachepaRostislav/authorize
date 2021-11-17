const Router = require('express').Router
const usercontroller = require('../controllers/user-controller')
const router = new Router()

router.post('/registration', usercontroller.registration)
router.post('/login', usercontroller.login)
router.post('/logout', usercontroller.logout)
router.get('/active/:link', usercontroller.activate)
router.get('/refresh', usercontroller.refresh)
router.get('/users', usercontroller.getUsers)

module.exports = router
