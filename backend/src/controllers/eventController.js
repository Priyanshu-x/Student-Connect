const asyncHandler = require('express-async-handler')
const Event = require('../models/Event')

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin/Organizer) - For now, any protected user can create
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, contacts } = req.body

  if (!title || !description || !date || !location) {
    res.status(400)
    throw new Error('Please enter all required fields for the event.')
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
    contacts,
    organizer: req.user._id, // The authenticated user is the organizer
  })

  res.status(201).json(event)
})

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).populate('organizer', 'name email').sort({ date: 1 }) // Populate organizer info

  res.status(200).json(events)
})

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email')

  if (event) {
    res.status(200).json(event)
  } else {
    res.status(404)
    throw new Error('Event not found')
  }
})

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin)
const updateEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, contacts } = req.body

  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(404)
    throw new Error('Event not found')
  }

  // Check if the authenticated user is the organizer of the event
  // In a real app, you might also check for an 'admin' role
  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Not authorized to update this event')
  }

  event.title = title || event.title
  event.description = description || event.description
  event.date = date || event.date
  event.location = location || event.location
  event.contacts = contacts || event.contacts

  const updatedEvent = await event.save()
  res.status(200).json(updatedEvent)
})

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer/Admin)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(404)
    throw new Error('Event not found')
  }

  // Check if the authenticated user is the organizer of the event
  // In a real app, you might also check for an 'admin' role
  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error('Not authorized to delete this event')
  }

  await event.deleteOne()
  res.status(200).json({ message: 'Event removed' })
})

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if user is already registered
  if (event.attendees.includes(req.user._id)) {
    res.status(400);
    throw new Error('User already registered for this event');
  }

  event.attendees.push(req.user._id);
  await event.save();

  res.status(200).json({ message: 'Registered for event successfully!' });
});

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
}