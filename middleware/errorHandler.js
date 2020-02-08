/**
 * Returns error response to the client.
 */
function errorHandler(err, req, res, next) {
  return res
    .status(500)
    .json({ success: false, message: 'Internal server error.' });
};

module.exports = errorHandler;
