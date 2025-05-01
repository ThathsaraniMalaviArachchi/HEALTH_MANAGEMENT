const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// @route   GET api/users
// @desc    Get all users
// @access  Admin
router.get('/', [auth, isAdmin], userController.getAllUsers);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Admin
router.get('/:id', [auth, isAdmin], userController.getUserById);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Admin
router.put('/:id', [auth, isAdmin], userController.updateUser);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/:id', [auth, isAdmin], userController.deleteUser);

module.exports = router;