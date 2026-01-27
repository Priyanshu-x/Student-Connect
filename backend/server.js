const express = require('express')
const asyncHandler = require('express-async-handler');
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./src/config/db')

dotenv.config()

const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes') // Import userRoutes
const verificationRoutes = require('./src/routes/verificationRoutes') // Import verificationRoutes
const eventRoutes = require('./src/routes/eventRoutes') // Import eventRoutes
const notificationRoutes = require('./src/routes/notificationRoutes') // Import notificationRoutes

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())
app.use('/uploads', express.static('uploads')) // Serve static files from the 'uploads' directory

app.get('/', (req, res) => {
  res.json({ message: 'SGSU API is running.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes) // Use userRoutes
app.use('/api/verify', verificationRoutes) // Use verificationRoutes
app.use('/api/events', eventRoutes) // Use eventRoutes
app.use('/api/notifications', notificationRoutes) // Use notificationRoutes

const { notFound, errorHandler } = require('./src/middleware/errorMiddleware')

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

