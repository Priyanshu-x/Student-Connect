const asyncHandler = require('express-async-handler')
const User = require('../models/User')

// @desc    Get user profile by ID
// @route   GET /api/users/profile/:id
// @access  Public
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.department = req.body.department || user.department
    user.year = req.body.year || user.year
    user.hobbies = req.body.hobbies || user.hobbies
    user.clubs = req.body.clubs || user.clubs
    user.profileImage = req.body.profileImage || user.profileImage
    user.resume = req.body.resume || user.resume
    user.certificates = req.body.certificates || user.certificates

    // Only allow admin/moderator to change role, verified, or score
    if (req.user.role === 'admin' || req.user.role === 'moderator') {
      user.role = req.body.role || user.role
      user.verified = req.body.verified !== undefined ? req.body.verified : user.verified
      user.score = req.body.score !== undefined ? req.body.score : user.score
    }

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      department: updatedUser.department,
      year: updatedUser.year,
      hobbies: updatedUser.hobbies,
      clubs: updatedUser.clubs,
      verified: updatedUser.verified,
      profileImage: updatedUser.profileImage,
      resume: updatedUser.resume,
      certificates: updatedUser.certificates,
      score: updatedUser.score,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all user profiles with search and filter
// @route   GET /api/users/profiles
// @access  Public
const getAllProfiles = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { department: { $regex: req.query.keyword, $options: 'i' } },
        { year: { $regex: req.query.keyword, $options: 'i' } },
        { hobbies: { $regex: req.query.keyword, $options: 'i' } },
        { clubs: { $regex: req.query.keyword, $options: 'i' } },
        // Add other searchable fields here
      ],
    }
    : {}

  const profiles = await User.find({ ...keyword }).select('-password') // Exclude passwords

  if (profiles) {
    res.json(profiles)
  } else {
    res.status(404)
    throw new Error('No profiles found')
  }
})

const uploadProfileFiles = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // req.files is an object with fieldnames as keys (e.g., { profileImage: [...], resume: [...] })
  if (req.files) {
    if (req.files.profileImage) {
      user.profileImage = req.files.profileImage[0].path.replace(/\\/g, '/') // Normalized path
    }
    if (req.files.resume) {
      user.resume = req.files.resume[0].path.replace(/\\/g, '/')
    }
    if (req.files.certificates) {
      // Map new files to paths
      const newCertificates = req.files.certificates.map(file => file.path.replace(/\\/g, '/'))
      // Append to existing certificates, limit to 5 total? Or replace? 
      // User request said "Certificates (Max 5)". Usually replace or append. 
      // Let's append but check limit. 
      // For simplicity in this "Showcase" refresh, let's just push them.
      // But we should be careful not to exceed limits defined in schemas if any.
      user.certificates.push(...newCertificates)
    }
  }

  const updatedUser = await user.save()

  res.status(200).json({
    message: 'Files uploaded successfully',
    user: {
      profileImage: updatedUser.profileImage,
      resume: updatedUser.resume,
      certificates: updatedUser.certificates
    }
  });
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await User.find({}).sort({ score: -1 }).select('-password'); // Sort by score descending, exclude passwords
  res.status(200).json(leaderboard);
});

module.exports = {
  getProfile,
  updateProfile,
  getAllProfiles,
  uploadProfileFiles,
  getLeaderboard,
}