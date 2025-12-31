const express = require('express')
const router = express.Router()
const { signUp, signIn, logout, allUsers } = require('../../controllers/users/user.controller.js')

router.get('/', allUsers)
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/logout', logout)

module.exports = router;
