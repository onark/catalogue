const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const catsRouter = require('./controllers/cats');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGODB_URI);

async function connectToMongoDB() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('connected to MongoDB');
  } catch (error) {
    logger.error('error connecting to MongoDB:', error.message);
  }
}

async function main() {
  await connectToMongoDB();

  app.use(cors());
  app.use(express.static('build'));
  app.use(express.json());
  app.use(middleware.requestLogger);

  app.use('/api/cats', catsRouter);

  app.use(middleware.unknownEndpoint);
  app.use(middleware.errorHandler);
}

main();

module.exports = app;
