const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');

const app = express();
require('express-async-errors');
const notesRouter = require('./controller/noteController');
const userRouter = require('./controller/userController');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
