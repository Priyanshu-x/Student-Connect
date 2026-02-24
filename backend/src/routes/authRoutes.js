const express = require('express')
const { claimProfile, login, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/claim', claimProfile)
router.post('/login', login)
router.get('/me', protect, getMe)

module.exports = router

