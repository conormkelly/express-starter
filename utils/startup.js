const logger = require('./logger');

const config = require('../config');

/**
 * Initialize all pre-requisites before starting the application.
 */
async function initialize() {
  try {
    await config.validateEnvironmentVariables();
  } catch (err) {
    logger.error({ message: err.message, category: 'STARTUP' });
    process.exit(1);
  }
}

/**
 * Begin listening on the _PORT_ specified in environment variables.
 */
exports.start = async app => {
  await initialize();

  const PORT = process.env.PORT;

  app.listen(PORT, () => {
    logger.info(`App: Listening on port ${PORT}`);
  });
};
