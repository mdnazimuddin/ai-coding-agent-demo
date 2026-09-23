const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const {
  createUserValidation,
  updateUserValidation,
  validateObjectId,
  validate
} = require('../middlewares/validator');

// POST / - Create a new user
router.post('/', createUserValidation, validate, createUser);

// GET / - Retrieve all users with filtering, sorting, and pagination
router.get('/', getAllUsers);

// GET /:id - Retrieve a single user by ID
router.get('/:id', validateObjectId, getUserById);

// PUT /:id - Update an existing user by ID
router.put('/:id', validateObjectId, updateUserValidation, validate, updateUser);

// DELETE /:id - Delete a user by ID
router.delete('/:id', validateObjectId, deleteUser);

module.exports = router;
