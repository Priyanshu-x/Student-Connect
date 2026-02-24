const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const Project = require('../models/Project')
const User = require('../models/User') // Assuming you might need user details
const { protect } = require('../middleware/authMiddleware') // Assuming you have auth middleware

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const projects = await Project.find({}).populate('student', 'name avatar department')
        res.json(projects)
    })
)

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const { title, description, techStack, githubLink, demoLink, image } = req.body

        const project = new Project({
            title,
            description,
            techStack,
            githubLink,
            demoLink,
            image,
            student: req.user._id,
        })

        const createdProject = await project.save()

        // Optionally update user score here (e.g., +10 points for a project)
        const user = await User.findById(req.user._id)
        if (user) {
            user.score = (user.score || 0) + 10
            await user.save()
        }

        res.status(201).json(createdProject)
    })
)

// @desc    Get projects by user ID
// @route   GET /api/projects/user/:userId
// @access  Public
router.get(
    '/user/:userId',
    asyncHandler(async (req, res) => {
        const projects = await Project.find({ student: req.params.userId })
        res.json(projects)
    })
)

module.exports = router
