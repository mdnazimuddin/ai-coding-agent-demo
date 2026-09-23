let UserModel;
try {
  UserModel = require('../models/userModel');
} catch (e) {
  UserModel = require('../models/User');
}

/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Public
 */
const createUser = async (req, res, next) => {
  try {
    const { name, email, age, status } = req.body;
    const user = await UserModel.create({ name, email, age, status });
    return res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get all users with search, filter, sort, and pagination
 * @route   GET /api/v1/users
 * @access  Public
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const queryContext = {};

    if (req.query.search) {
      queryContext.name = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.status) {
      queryContext.status = req.query.status;
    }

    let sortOptions = {};
    if (req.query.sortBy) {
      const order = req.query.order === 'desc' ? -1 : 1;
      sortOptions[req.query.sortBy] = order;
    } else {
      sortOptions = { createdAt: -1 };
    }

    const total = await UserModel.countDocuments(queryContext);

    if (total === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        totalPages: 0,
        currentPage: page,
        data: []
      });
    }

    const users = await UserModel.find(queryContext)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      count: total,
      totalPages,
      currentPage: page,
      data: users
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers
};
