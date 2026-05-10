/**
 * Filter an object to only include allowed fields.
 * Useful for sanitizing user-submitted data before database updates.
 *
 * @param {object} obj - The source object
 * @param  {...string} allowedFields - Fields to keep
 * @returns {object} Filtered object
 */
const filterObj = (obj, ...allowedFields) => {
  const filtered = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

/**
 * Build a standardized API success response.
 *
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {*} data - Response payload
 */
const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    status: 'success',
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Build a pagination metadata object.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {object} Pagination metadata
 */
const getPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = { filterObj, sendResponse, getPagination };
