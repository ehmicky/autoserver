'use strict';

const database = require('./data.json');

const connect = function () {
  return database;
};

module.exports = {
  connect,
};
