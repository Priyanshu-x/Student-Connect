const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const generateOTP = require('../utils/generateOTP') // We will create this
const sendEmail = require('../utils/sendEmail') // We will create this

// @desc    Send OTP to user's registered email
// @route   POST /api/verify/otp/send
// @access  Private
const sendOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Generate OTP
  const otp = generateOTP()
  user.otp = otp
  user.otpExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

  await user.save()

  // Send OTP via email
  const message = `Your OTP for SGSU profile verification is: ${otp}. It is valid for 10 minutes.`
  try {
    await sendEmail({
      email: user.email,
      subject: 'SGSU Profile Verification OTP',
      message,
    })
    res.status(200).json({ message: 'OTP sent to your email.' })
  } catch (error) {
    user.otp = undefined
    user.otpExpires = undefined
    await user.save()
    res.status(500)
    throw new Error('Email could not be sent. Please try again later.')
  }
})

// @desc    Verify OTP
// @route   POST /api/verify/otp/verify
// @access  Private
const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    res.status(400)
    throw new Error('Invalid or expired OTP.')
  }

  user.verified = true
  user.otp = undefined
  user.otpExpires = undefined
  await user.save()

  res.status(200).json({ message: 'Profile verified successfully!', verified: true })
})

// @desc    Handle SSO callback (placeholder)
// @route   GET /api/verify/sso/callback
// @access  Private
const ssoCallback = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // In a real SSO scenario, you would receive user data from the SSO provider
  // and update the user's verified status here.
  // For now, we'll just mark it as verified for demonstration.
  user.verified = true
  await user.save()

  res.status(200).json({ message: 'SSO verification successful!', verified: true })
})

// @desc    Upload verification documents
// @route   POST /api/verify/docs/upload
// @access  Private
const uploadVerificationDocs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (!req.files || req.files.length === 0) {
    res.status(400)
    throw new Error('No documents uploaded.')
  }

  const documentPaths = req.files.verificationDocs.map(
    (file) => `/uploads/verificationDocs/${file.filename}`
  )

  // Assuming a new field in User model for verification documents
  user.verificationDocuments = user.verificationDocuments
    ? [...user.verificationDocuments, ...documentPaths]
    : documentPaths
  
  // In a real application, these documents would be reviewed by an admin.
  // We'll mark the user as pending verification for now.
  user.verified = false // Or a 'pending' status
  await user.save()

  res.status(200).json({
    message: 'Verification documents uploaded for review. Status pending.',
    documents: user.verificationDocuments,
  })
})

module.exports = {
  sendOtp,
  verifyOtp,
  ssoCallback,
  uploadVerificationDocs,
}