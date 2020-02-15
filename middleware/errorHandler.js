const ErrorResponse = require('../utils/error-handling/ErrorResponse');

/**
 * Returns error response to the client.
 */
function errorHandler(err, req, res, next) {
  // Check if known error
  if (err instanceof ErrorResponse) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // Return 500 with standard message, to prevent leaking errors to the client
  // Full error will be logged by express-winston anyway
  return res
    .status(500)
    .json({
      success: false,
      message: "We're sorry, an internal server error has occurred."
    });
}

module.exports = errorHandler;
