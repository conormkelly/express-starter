/**
 * Returns error response to the client.
 */
function errorHandler(err, req, res, next) {
  return res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message || "We're sorry, an internal server error has occurred." });
};

module.exports = errorHandler;
