let User;
try {
  User = require('../models/userModel');
} catch (e) {
  try {
    User = require('../models/User');
  } catch (err) {
    User = require('../models/user.model');
  }
}

/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Public
 */
const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with filtering, sorting, and pagination
 * @route   GET /api/v1/users
 * @access  Public
 */
const getAllUsers = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    let query = User.find(JSON.parse(queryStr));

    // Field Selection
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    const users = await query;

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/v1/users/:id
 * @access  Public
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error(`User not found with id of ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user by ID
 * @route   PUT /api/v1/users/:id
 * @access  Public
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      const error = new Error(`User not found with id of ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user by ID
 * @route   DELETE /api/v1/users/:id
 * @access  Public
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error = new Error(`User not found with id of ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUsers: getAllUsers,
  getAllUsers,
  getUser: getUserById,
  getUserById,
  updateUser,
  deleteUser
};
