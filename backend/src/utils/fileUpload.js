const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/'
    if (file.fieldname === 'profileImage') {
      uploadPath += 'profileImages/'
    } else if (file.fieldname === 'resume') {
      uploadPath += 'resumes/'
    } else if (file.fieldname === 'certificates') {
      uploadPath += 'certificates/'
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = {
    profileImage: ['image/jpeg', 'image/jpg', 'image/png'],
    resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    certificates: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  }

  const allowedTypes = allowedFileTypes[file.fieldname]
  if (allowedTypes && allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}.`), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
})

module.exports = upload