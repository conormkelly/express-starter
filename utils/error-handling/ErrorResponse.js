/**
 * Used to encapsulate business errors and allows us
 * to cleanly return client-friendly error messages.
 */
class ErrorResponse extends Error {
  /**
   * @param {{message: string, details: string, statusCode: number, shouldIncludeStack: boolean}} errorResponse
   */
  constructor({message, statusCode, details, shouldIncludeStack}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    // Controls whether to log the stackTrace in expressWinstonErrorLogger.
    // By default, exclude the stack from being logged for known /
    // "business errors" unless explicitly specified.
    this.shouldIncludeStack = shouldIncludeStack || false;
  }
}

module.exports = ErrorResponse;
