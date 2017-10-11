'use strict';

const memoryAdapter = require('./memory');
const mongodbAdapter = require('./mongodb');

module.exports = {
  memoryAdapter,
  mongodbAdapter,
};
