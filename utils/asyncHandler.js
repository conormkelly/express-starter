/**
 * Wraps a controller method to ensure that unhandled promise rejections
 * are passed to the errorHandler middleware.
 */
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
