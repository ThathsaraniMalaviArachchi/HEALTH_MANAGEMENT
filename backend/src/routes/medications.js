const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all medications for the authenticated user
router.get('/', medicationController.getAll);

// Get a specific medication by ID
router.get('/:id', medicationController.getOne);

// Create a new medication
router.post('/', medicationController.create);

// Update a medication
router.put('/:id', medicationController.update);

// Delete a medication
router.delete('/:id', medicationController.delete);

module.exports = router;