/**
 * Used to encapsulate business errors and allows us
 * to cleanly return client-friendly error messages.
 */

class ErrorResponse extends Error {
  constructor(message, statusCode, options) {
    super();
    this.message = message;
    this.statusCode = statusCode;

    // Controls whether to log the stackTrace in expressWinstonErrorLogger.
    // By default, exclude the stack from being logged for known /
    // "business errors" unless explicitly specified.
    this.shouldIncludeStack = (options && options.shouldIncludeStack) || false;
  }
}

module.exports = ErrorResponse;
