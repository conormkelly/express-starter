/**
 * 404 handler that sends a JSON response - including the error message, and traceId.
 */
function invalidRouteHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    traceId: req.traceId
  });
}

module.exports = invalidRouteHandler;
