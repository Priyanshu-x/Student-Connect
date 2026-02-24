const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        techStack: {
            type: [String],
            default: [],
        },
        githubLink: {
            type: String,
            trim: true,
        },
        demoLink: {
            type: String,
            trim: true,
        },
        image: {
            type: String, // URL to project image
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)
