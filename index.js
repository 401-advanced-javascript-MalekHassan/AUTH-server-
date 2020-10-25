'use strict';

require('dotenv').config;
const mongoose = require('mongoose');
const server = require('./src/server');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.start(process.env.PORT || 3000);
  })
  .catch((err) => console.error(err.message));
