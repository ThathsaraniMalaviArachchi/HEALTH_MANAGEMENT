const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// All appointment routes require authentication
router.use(auth);

// User routes
router.post('/', appointmentController.create);
router.get('/user', appointmentController.getUserAppointments);
router.put('/:id/cancel', appointmentController.cancelAppointment);

// Admin routes
router.get('/all', isAdmin, appointmentController.getAllAppointments);
router.put('/:id/status', isAdmin, appointmentController.updateStatus);

module.exports = router;