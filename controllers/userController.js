const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Public
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, phone, age, address, status } = req.body;

    // Check if user already exists with the provided email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (typeof apiResponse === 'function') {
        return apiResponse(res, 409, 'User with this email already exists');
      }
      if (apiResponse && typeof apiResponse.errorResponse === 'function') {
        return apiResponse.errorResponse(res, 409, 'User with this email already exists');
      }
      if (apiResponse && typeof apiResponse.error === 'function') {
        return apiResponse.error(res, 409, 'User with this email already exists');
      }
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Instantiate new User document
    const user = new User({
      name,
      email,
      phone,
      age,
      address,
      status
    });

    // Persist to database
    const savedUser = await user.save();

    // Return 201 Created
    if (typeof apiResponse === 'function') {
      return apiResponse(res, 201, 'User created successfully', savedUser);
    }
    if (apiResponse && typeof apiResponse.successResponse === 'function') {
      return apiResponse.successResponse(res, 201, 'User created successfully', savedUser);
    }
    if (apiResponse && typeof apiResponse.success === 'function') {
      return apiResponse.success(res, 201, 'User created successfully', savedUser);
    }
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: savedUser
    });
  } catch (error) {
    if (error.code === 11000) {
      if (typeof apiResponse === 'function') {
        return apiResponse(res, 409, 'User with this email already exists');
      }
      if (apiResponse && typeof apiResponse.errorResponse === 'function') {
        return apiResponse.errorResponse(res, 409, 'User with this email already exists');
      }
      if (apiResponse && typeof apiResponse.error === 'function') {
        return apiResponse.error(res, 409, 'User with this email already exists');
      }
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    next(error);
  }
};

module.exports = {
  createUser
};
