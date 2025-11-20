const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, department, year } = req.body

  if (!name || !email || !password || !department || !year) {
    res.status(400)
    throw new Error('Please provide all required fields.')
  }

  if (password.length < 6) {
    res.status(400)
    throw new Error('Password must be at least 6 characters.')
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    res.status(409)
    throw new Error('An account with this email already exists.')
  }

  const user = await User.create({
    name,
    email,
    password,
    department,
    year,
  })

  if (user) {
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        verified: user.verified,
      },
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
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
      email: user.email,
      department: user.department,
      year: user.year,
      verified: user.verified,
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
  signup,
  login,
  getMe,
}

