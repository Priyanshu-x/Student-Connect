const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    collegeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    isClaimed: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // Password is required only if the account is claimed
      required: function () { return this.isClaimed },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'moderator'],
      default: 'student',
    },
    department: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: '',
    },
    hobbies: {
      type: [String],
      default: [],
    },
    clubs: {
      type: [String],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profileImage: String,
    resume: String,
    certificates: {
      type: [String],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
    },
    otp: String,
    otpExpires: Date,
    verificationDocuments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)

