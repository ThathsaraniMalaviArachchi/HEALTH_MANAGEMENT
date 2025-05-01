const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// All doctor routes require authentication
router.use(auth);

// Get all doctors (for both users and admins)
router.get('/', doctorController.getAll);

// Get doctor by ID (for both users and admins)
router.get('/:id', doctorController.getById);

// Admin-only routes
router.post('/', isAdmin, doctorController.create);
router.put('/:id', isAdmin, doctorController.update);
router.delete('/:id', isAdmin, doctorController.delete);

module.exports = router;