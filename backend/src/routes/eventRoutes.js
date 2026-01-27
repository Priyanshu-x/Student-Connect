const express = require('express')
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require('../controllers/eventController')
const { protect } = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware') // Import authorizeRoles

const router = express.Router()

router
  .route('/')
  .post(protect, authorizeRoles('admin', 'moderator'), createEvent) // Restrict creation to admin/moderator
  .get(getEvents)
router
  .route('/:id')
  .get(getEventById)
  .put(protect, authorizeRoles('admin', 'moderator'), updateEvent) // Restrict update to admin/moderator
  .delete(protect, authorizeRoles('admin', 'moderator'), deleteEvent) // Restrict deletion to admin/moderator

router.post('/:id/register', protect, registerForEvent)

module.exports = router