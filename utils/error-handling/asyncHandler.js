/**
 * Wraps a controller method to ensure that unhandled promise rejections
 * are passed to the errorHandler middleware.
 */
const asyncHandler = fn => async (req, res, next) => {
  await Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
