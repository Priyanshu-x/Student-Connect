const express = require('express')
const {
  sendOtp,
  verifyOtp,
  ssoCallback,
  uploadVerificationDocs,
} = require('../controllers/verificationController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../utils/fileUpload')

const router = express.Router()

router.post('/otp/send', protect, sendOtp)
router.post('/otp/verify', protect, verifyOtp)
// For SSO, a redirect from the identity provider would typically hit this endpoint
router.get('/sso/callback', protect, ssoCallback)
router.post(
  '/docs/upload',
  protect,
  upload.fields([{ name: 'verificationDocs', maxCount: 3 }]), // Max 3 documents
  uploadVerificationDocs
)

module.exports = router