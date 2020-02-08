const express = require('express');
const app = express();

const logger = require('./utils/logger');

const helmet = require('helmet');
const addTraceId = require('express-request-id');
const httpContext = require('express-http-context');
const { expressWinstonLogger, expressWinstonErrorLogger } = logger;

const router = require('./routes');

// Middleware
app.use(helmet());
app.use(express.json());

// For logging purposes
app.use(addTraceId({ attributeName: 'traceId' }));

// Set req http-context in order to be able to fetch traceId in logger
app.use(httpContext.middleware);
app.use((req, res, next) => {
  httpContext.set('req', req);
  next();
});

// express-winston logging
app.use(expressWinstonLogger);

// Mount routes
app.use('/api/v1', router);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: `Cannot ${req.method} ${req.url}`,
      traceId: req.traceId
    });
});

// express-winston error logging
app.use(expressWinstonErrorLogger);

// Error handler
app.use((err, req, res, next) => {
  return res
    .status(500)
    .json({ success: false, message: 'Internal server error.' });
});

// Listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`)
});
