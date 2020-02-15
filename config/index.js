const logger = require('../utils/logger');
const AppError = require('../utils/error/AppError');

const REQUIRED_ENV_VARS = ['NODE_ENV', 'PORT', 'MONGO_URI'];

/**
 * Ensure all neccessary environment variables have been set.
 */
exports.validateEnvironmentVariables = () => {
  logger.info('ENV: Validating environment variables');

  REQUIRED_ENV_VARS.forEach(envVar => {
    if (!process.env[envVar]) {
      throw new AppError(
        'EnvironmentError',
        `'${envVar}' is required`
      );
    }
  });

  logger.info('ENV: Validation successful');
};
