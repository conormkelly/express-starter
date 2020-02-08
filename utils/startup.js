const logger = require('./logger');

/**
 * Begin listening on the _PORT_ specified in environment variables.
 */
exports.start = app => {
  const PORT = process.env.PORT;

  app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
  });
};
