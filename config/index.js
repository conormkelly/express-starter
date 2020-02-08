const logger = require('../utils/logger');

const REQUIRED_ENV_VARS = ['NODE_ENV', 'PORT', 'MONGO_URI'];

/**
 * Ensure all neccessary environment variables have been set.
 */
exports.validateEnvironmentVariables = () => {
  logger.info('ENV: Validating environment variables');

  for (i in REQUIRED_ENV_VARS) {
    const envVar = REQUIRED_ENV_VARS[i];
    if (!process.env[envVar]) {
      throw new Error(`ENV: '${envVar}' is required but not valued`);
    }
  }

  logger.info('ENV: Validation successful');
}
