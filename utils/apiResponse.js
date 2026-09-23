/**
 * Generates a standardized API success response.
 *
 * @param {Object} res - Express response object
 * @param {number} [statusCode=200] - HTTP status code
 * @param {string} [message='Success'] - Descriptive success message
 * @param {*} [data=null] - Response payload data
 * @param {Object} [extraParams={}] - Extra properties (e.g. count, totalPages, currentPage)
 * @returns {Object} Express JSON response
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null, extraParams = {}) => {
  const payload = {
    success: true,
    message,
    data,
    ...(extraParams && typeof extraParams === 'object' ? extraParams : {})
  };

  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse
};
