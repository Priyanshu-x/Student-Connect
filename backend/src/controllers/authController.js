const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const claimProfile = asyncHandler(async (req, res) => {
  const { collegeId, email, password } = req.body

  if (!collegeId || !email || !password) {
    res.status(400)
    throw new Error('Please provide College ID, Email, and a new Password.')
  }

  // 1. Find user by College ID
  const user = await User.findOne({ collegeId: collegeId.toUpperCase() })

  if (!user) {
    res.status(404)
    throw new Error('Student record not found. Please contact administration.')
  }

  // 2. Check if already claimed
  if (user.isClaimed) {
    res.status(409)
    throw new Error('This profile has already been claimed. Please log in.')
  }

  // 3. Verify Email Match (In a real app, we'd send an OTP here)
  if (user.email.toLowerCase() !== email.toLowerCase()) {
    res.status(401)
    throw new Error('Email does not match our records for this ID.')
  }

  // 4. Claim Profile
  user.password = password // Will be hashed by pre-save hook
  user.isClaimed = true
  user.verified = true // Auto-verify on claim for this demo
  await user.save()

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      collegeId: user.collegeId,
      email: user.email,
      department: user.department,
      year: user.year,
      verified: user.verified,
      isClaimed: true,
    },
  })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password.')
  }

  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('Invalid credentials.')
  }

  if (!user.isClaimed) {
    res.status(403)
    throw new Error('Profile exists but is unclaimed. Please claim your profile first.')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    res.status(400)
    throw new Error('Invalid credentials.')
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      collegeId: user.collegeId,
      email: user.email,
      department: user.department,
      year: user.year,
      verified: user.verified,
      isClaimed: user.isClaimed,
    },
  })
})

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

module.exports = {
  claimProfile,
  login,
  getMe,
}

