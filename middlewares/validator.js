const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

/**
 * Validation error handling middleware.
 * Formats express-validator error results into standard API response schema.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  next();
};

/**
 * Validation rules for creating a user (POST)
 */
const createUserValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString()
    .withMessage('Phone must be a string'),
  body('age')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1, max: 150 })
    .withMessage('Age must be an integer between 1 and 150')
    .toInt(),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters'),
  body('status')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
];

/**
 * Validation rules for updating a user (PUT/PATCH)
 */
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isString()
    .withMessage('Phone must be a string'),
  body('age')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1, max: 150 })
    .withMessage('Age must be an integer between 1 and 150')
    .toInt(),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters'),
  body('status')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be either active or inactive')
];

/**
 * Middleware to validate MongoDB ObjectId parameters in the request URL.
 * Can be used as `validateObjectId` (defaults to 'id') or `validateObjectId('customParam')`.
 */
const validateObjectId = (paramNameOrReq = 'id', res, next) => {
  if (typeof paramNameOrReq === 'string') {
    const paramName = paramNameOrReq;
    return (req, res, next) => {
      const id = req.params[paramName];
      const isValid = id && mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format',
          errors: [
            {
              field: paramName,
              message: `Invalid ObjectId format for parameter '${paramName}'`
            }
          ]
        });
      }
      next();
    };
  }

  // Direct middleware usage: validateObjectId(req, res, next)
  const req = paramNameOrReq;
  const id = req.params.id;
  const isValid = id && mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      errors: [
        {
          field: 'id',
          message: "Invalid ObjectId format for parameter 'id'"
        }
      ]
    });
  }
  next();
};

module.exports = {
  validate,
  createUserValidation,
  updateUserValidation,
  validateObjectId
};
