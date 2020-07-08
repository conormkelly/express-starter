// Utils
const logger = require('../utils/logger');

const Ajv = require('ajv');

const ajv = new Ajv({
  coerceTypes: true, // auto-converts types e.g. a string of "true" will be converted to a boolean if the type is specified as such
  useDefaults: true, // fallback to the default if a particular value is not supplied
  removeAdditional: true, // we are only interested in environment variables for this app
  allErrors: true, // required by ajv-errors
  jsonPointers: true, // required by ajv-errors for "interpolation"
});

// Patch AJV with the "ajv-errors" module to allow custom error messages
require('ajv-errors')(ajv);

// Make a copy of the process.env environment variables
// because these can be modified implicitly by AJV once validation is performed.
// Also, encapsulating this method aids with mocking
let ENV_COPY = copyProcessEnv();

// Defines how the environment variables should be validated
const envSchema = {
  type: 'object',
  additionalProperties: false, // Because removeAdditional (above) is true,
  // properties we have *not* defined in this schema
  // will ultimately NOT be exported from this module as part of "config"
  properties: {
    NODE_ENV: {
      enum: ['local', 'dev', 'qa', 'stage', 'prod'],
      shouldMaskValue: false,
    },
    PORT: { type: 'number', default: 3000, shouldMaskValue: false },
    MONGO_URI: {
      type: 'string',
      default: 'mongodb://127.0.0.1:27017/my-starter-db',
      pattern: '^mongodb:\\/\\/[^/]+\\/[\\w-]+$',
      shouldMaskValue: true, // may contain username and password
    },
  },
  errorMessage: {
    properties: {
      // NOT template literal syntax - this is how ajv-errors interpolates the schema values
      NODE_ENV: `NODE_ENV should be one of ['local', 'dev', 'qa', 'stage', 'prod'], current value is \${/NODE_ENV}`,
      PORT: 'PORT should be a number, current value is ${/PORT}',
      MONGO_URI: `MONGO_URI should be a valid connection string`,
    },
  },
  required: ['NODE_ENV', 'PORT'],
};

/**
 * NOTE: When working with environment variables, it is safer to make a copy *before* validation.
 * AJV can *implicitly* modify data being validated BY REFERENCE,
 * e.g. the data may differ from what you expect by means of replacement with defaults or type coercion.
 */
function copyProcessEnv() {
  return { ...process.env };
}

/**
 * Performs validation on the environment variables.
 * Exits if it does not conform to the schema.
 */
function validateEnvironmentVariables() {
  // Get the names of all "app env vars" i.e env vars defined in the schema
  const appEnvVarNames = Object.keys(envSchema.properties);

  // Before we perform validation, just log all the initial values from process.env
  // so we can distinguish between default values and interpret the flow better
  logger.info('Env validation: INITIAL VALUES');
  for (let envVarName of appEnvVarNames) {
    let value = ENV_COPY[envVarName];
    safelyLogValue(envVarName, value);
  }

  // Validate against the schema
  const validator = ajv.compile(envSchema);
  const isValid = validator(ENV_COPY);

  // Check if any defaults were used
  const defaultedEnvVarNames = appEnvVarNames.filter((envVarName) => {
    const hasDefaultSet = envSchema.properties[envVarName].default != undefined;
    const hasMismatchedValue = ENV_COPY[envVarName] != process.env[envVarName];

    return hasDefaultSet && hasMismatchedValue;
  });

  // Log any defaults that were set
  if (defaultedEnvVarNames.length > 0) {
    logger.warn('Env validation: DEFAULTS SET');

    for (const defaultedEnvVarName of defaultedEnvVarNames) {
      safelyLogValue(defaultedEnvVarName, ENV_COPY[defaultedEnvVarName]);
    }
  }

  // Exit if validation errors
  if (!isValid) {
    logAndExit(validator.errors);
  } else {
    logger.info('Env validation: SUCCESS');
  }
}

/**
 * Mask the value of an environment variable with asterisks if _shouldMaskValue_ is **true**.
 */
function safelyLogValue(envVarName, value) {
  const shouldMaskValue = envSchema.properties[envVarName].shouldMaskValue;

  if (shouldMaskValue) {
    // Because we are executing an instance method on the value,
    // we need to be sure it IS valued, otherwise we exec a method on _undefined_
    logger.info(
      `${envVarName}: ${
        value !== undefined ? value.replace(/./g, '*') : undefined
      }`
    );
  } else {
    logger.info(`${envVarName}: ${value}`);
  }
}

/**
 * If this happens, the env config does not conform to the schema,
 * i.e. the application is missing required variables so we should just
 * log the entire array of errors and quit the app.
 */
function logAndExit(validatorErrors) {
  logger.error('Env validation: FAILURE');

  const errorMessages = validatorErrors.map((e) => e.message);
  for (let errorMessage of errorMessages) {
    logger.error(errorMessage);
  }
  process.exit(1);
}

module.exports = { config: ENV_COPY, validateEnvironmentVariables };
