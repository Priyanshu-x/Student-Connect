const express = require('express')
const asyncHandler = require('express-async-handler');
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./src/config/db')

dotenv.config()

const authRoutes = require('./src/routes/authRoutes')

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'SGSU API is running.' })
})

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

