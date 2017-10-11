'use strict';

const database = require('./data.json');

// Starts connection
const connect = function () {
  return database;
};

module.exports = {
  connect,
};
