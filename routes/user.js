const express = require('express')
const router = express.Router()
const Auth = require('../middleware/isAuthenticated')

const { LoginUser, getUserById,RegisterUser, UpdateUserById, deleteUserById } = require('../controllers/user')

//Authentication
router.post('/api/user/login', LoginUser)
router.post('/api/user/register',RegisterUser)

//User Profile
router.get('/api/user/:id',Auth, getUserById)
router.put('/api/user',Auth, UpdateUserById)
router.delete('/api/user/:id',Auth, deleteUserById)

module.exports = router;


