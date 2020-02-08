const express = require('express');
const app = express();

const helmet = require('helmet');
const addTraceId = require('express-request-id');
const httpContext = require('express-http-context');
const { expressWinstonLogger, expressWinstonErrorLogger } = require('./utils/logger');
const router = require('./routes');
const invalidRouteHandler = require('./middleware/invalidRouteHandler');
const errorHandler = require('./middleware/errorHandler');

const { start } = require('./utils/startup');

// Middleware
app.use(helmet());
app.use(express.json());

// Add traceId to all requests, for correlation in the logs
app.use(addTraceId({ attributeName: 'traceId' }));

// Allows us to get traceId in the logger module
app.use(httpContext.middleware);
app.use((req, res, next) => {
  httpContext.set('traceId', req.traceId);
  next();
});

// Log info on all requests
app.use(expressWinstonLogger);

// Mount routes
app.use('/api/v1', router);

// Handle 404s
app.use(invalidRouteHandler);

// Log errors
app.use(expressWinstonErrorLogger);

// Form error responses
app.use(errorHandler);

start(app);
