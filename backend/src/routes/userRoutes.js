const express = require('express')
const {
  getProfile,
  updateProfile,
  uploadProfileFiles,
  getAllProfiles,
  getLeaderboard,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../utils/fileUpload') // Import the file upload middleware

const router = express.Router()

router.get('/profile/:id', getProfile)
router.put('/profile', protect, updateProfile)
router.post(
  '/profile/upload',
  protect,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'certificates', maxCount: 5 },
  ]),
  uploadProfileFiles
)
router.get('/profiles', getAllProfiles) // For the public search feature
router.get('/leaderboard', getLeaderboard)

module.exports = router