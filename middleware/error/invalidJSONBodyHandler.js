const ErrorResponse = require('../../utils/error/ErrorResponse');

/**
 * Returns a formulated error response if express.json / bodyparser throws an error.
 */
const invalidJSONBodyHandler = (err, req, res, next) => {
  if (err && err instanceof SyntaxError && 'body' in err) {
    return next(
      new ErrorResponse({
        message: 'Invalid JSON body provided.',
        statusCode: 400
      })
    );
  }
  next();
};

module.exports = invalidJSONBodyHandler;
