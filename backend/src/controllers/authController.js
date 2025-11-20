const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password, department, year } = req.body

    if (!name || !email || !password || !department || !year) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all required fields.' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: 'Password must be at least 6 characters.' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'An account with this email already exists.' })
    }

    const user = await User.create({
      name,
      email,
      password,
      department,
      year,
    })

    const token = generateToken(user._id)

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        verified: user.verified,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' })
    }

    const token = generateToken(user._id)

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        verified: user.verified,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

