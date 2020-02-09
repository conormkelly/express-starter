// Utilities
const _ = require('lodash');

// Logging modules
const winston = require('winston');
const { format } = winston;
const expressWinston = require('express-winston');

// Allows setting and getting of the req context,
// In order to log traceId / correlationID, clientId from req etc
const httpContext = require('express-http-context');

// Formatting options for the winston transports
const transportOptions = {
  development: {
    level: 'debug',
    handleExceptions: true,
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
      format.printf(formatForLocal)
    )
  },
  production: {
    level: 'info',
    handleExceptions: true,
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
      format.printf(formatForProduction)
    )
  }
};

// Select transport options based on env,
// As formatting is different for local dev vs prod
const envTransportOptions =
  process.env.NODE_ENV === 'production'
    ? transportOptions.production
    : transportOptions.development;

// Create logger instances
const logger = winston.createLogger({
  transports: [new winston.transports.Console(envTransportOptions)]
});

exports.expressWinstonLogger = expressWinston.logger({
  msg:
    '{{req.method}} {{req.url}} returned {{res.statusCode}} in {{res.responseTime}}ms',
  dynamicMeta: (req, res) => {
    return { traceId: req.traceId };
  },
  statusLevels: true,
  winstonInstance: logger
});

exports.expressWinstonErrorLogger = expressWinston.errorLogger({
  msg:
    '{{req.method}} {{req.url}} returned {{res.statusCode}} in {{res.responseTime}}ms',
  dynamicMeta: (req, res, err) => {
    return { traceId: req.traceId };
  },
  winstonInstance: logger
});

// Expose logger methods
exports.error = message => {
  logger.error(message);
};

exports.warn = message => {
  logger.warn(message);
};

exports.debug = message => {
  logger.debug(message);
};

exports.info = message => {
  logger.info(message);
};

// Formatting methods

/**
 * Creates a standarized object from an existing winston or
 * express-winston info object, including metadata such as
 * tracking ids if available.
 * @param {*} info Winston object representing the log message.
 * @returns {*} Formatted log entry object.
 */
function buildLogEntry(info) {
  // Get traceId if present
  let traceId = httpContext.get('traceId');

  // Add traceId from express winston / error logger
  if (info.hasOwnProperty('meta')) {
    // Always present - added via dynamicMeta
    traceId = info.meta.traceId;
  }

  let logEntry = { traceId };

  if (typeof info.message === 'string') {
    // If string, extract schema props from info
    let { message, file, method, category } = info;
    logEntry = { ...logEntry, message, file, method, category };
  } else {
    // Extract the properties from info.message to flatten log entry
    let { message, file, method, category } = info.message;
    logEntry = { ...logEntry, message, file, method, category };
  }
  // Add error metadata if present.
  // * Only expressWinstonErrorLogger is configured to include the meta property.
  if (!_.isEmpty(info.meta) && !_.isUndefined(info.meta.error)) {
    const { error, message, trace } = info.meta;

    const errorMessage = `${error.name}: ${error.message}` || message;
    // Include stackTrace if it exists and it's not a known error with a status code,
    // unless we have specified that the stack should be logged.
    // Unknown errors will always log the stack.
    let stackTrace =
      !_.isEmpty(trace) && (!error.statusCode || error.shouldLogStack);

    logEntry = {
      ...logEntry,
      message: errorMessage,
      stackTrace,
      category: !error.statusCode ? 'UNHANDLED' : 'KNOWN'
    };
  }

  return logEntry;
}

/**
 * Returns pretty-printed JSON-like representation for
 * viewing log messages in the console during development.
 * @param {*} info Winston object representing the log message.
 */
function formatForLocal(info) {
  let logEntry = buildLogEntry(info);
  const header = `${info.timestamp} ${info.level}`;

  const hasOnlyMessageProperty =
    logEntry.message &&
    _.keys(logEntry).filter(k => !_.isUndefined(logEntry[k])).length === 1;

  if (hasOnlyMessageProperty) {
    return `${header} : ${logEntry.message}`;
  } else {
    return `${header} : ${JSON.stringify(logEntry, null, 2)}`;
  }
}

/**
 * Returns pretty-printed valid JSON for writing to stdout in production.
 * @param {*} info Winston object representing the log message.
 */
function formatForProduction(info) {
  let logEntry = {
    timestamp: info.timestamp,
    level: info.level,
    ...buildLogEntry(info)
  };
  return `${JSON.stringify(logEntry, null, 2)}`;
}
