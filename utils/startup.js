const { config, validateEnvironmentVariables } = require('../config');

const logger = require('./logger');

/**
 * Initialize all pre-requisites before starting the application.
 */
async function initialize() {
  try {
    validateEnvironmentVariables();
    // could also include async methods with "await"
  } catch (err) {
    logger.error({
      message: `${err.name}: ${err.message}`,
      category: 'STARTUP',
    });
    process.exit(1);
  }
}

/**
 * Begin listening on the _PORT_ specified in environment variables.
 */
exports.start = async (app) => {
  await initialize();

  const { PORT } = config;

  app.listen(PORT, () => {
    logger.info(`App: Listening on port ${PORT}`);
  });
};
