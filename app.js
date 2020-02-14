const express = require('express');
const app = express();

const helmet = require('helmet');
const addTraceId = require('express-request-id');
const httpContext = require('express-http-context');
const { expressWinstonLogger, expressWinstonErrorLogger } = require('./utils/logger');
const router = require('./routes');
const invalidJSONBodyHandler = require('./middleware/invalidJSONBodyHandler');
const invalidRouteHandler = require('./middleware/invalidRouteHandler');
const errorHandler = require('./middleware/errorHandler');

const { start } = require('./utils/startup');

//* Middleware
app.use(helmet());

// Add traceId to all requests, for correlation in the logs
app.use(addTraceId({ attributeName: 'traceId' }));

// Log info on all requests
app.use(expressWinstonLogger);

// Marshall request body into JSON
app.use(express.json());
app.use(invalidJSONBodyHandler);

// Allows us to get traceId in the logger module
app.use(httpContext.middleware);
app.use((req, res, next) => {
  httpContext.set('traceId', req.traceId);
  next();
});

//* Mount routes
app.use('/api/v1', router);

//* Error handling
// Handle 404s
app.use(invalidRouteHandler);

// Log errors
app.use(expressWinstonErrorLogger);

// Respond with santized error messages
app.use(errorHandler);

start(app);
