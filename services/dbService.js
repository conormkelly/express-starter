const logger = require('../utils/logger');

const mongoose = require('mongoose');

/**
 * Connect to the database specified by _MONGO_URI_ in environment variabes.
 */
exports.connect = async () => {
  const { MONGO_URI } = process.env;
  logger.info('DB: Connecting');

  let conn;
  try {
    conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  } catch (err) {
    logger.error('DB: Failed to connect');
    throw err;
  }

  logger.info(`DB: Connected to '${conn.connection.host}'`);
};
