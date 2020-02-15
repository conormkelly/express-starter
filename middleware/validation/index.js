const ErrorResponse = require('../../utils/error/ErrorResponse');

const VALID_OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

exports.validateId = resource => (req, res, next) => {
  const { id } = req.params;

  // Check it exists
  if (!id) {
    return next(
      new ErrorResponse({ message: "'id' is required.", statusCode: 400 })
    );
  }

  // Check it's a valid ObjectId
  const isValidObjectId = VALID_OBJECT_ID_REGEX.test(`${id}`);

  if (!isValidObjectId) {
    return next(
      new ErrorResponse({
        message: `No ${resource} found with ID: '${id}'.`,
        statusCode: 404
      })
    );
  }
  next();
};
