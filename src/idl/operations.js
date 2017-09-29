'use strict';

const { operationHandlers } = require('../operations');

const { idlReducer } = require('./reducer');

const getProcessors = function () {
  return Object.values(operationHandlers)
    .map(({ compileIdl }) => compileIdl)
    .filter(compileIdl => compileIdl);
};

const processors = getProcessors();

// Apply operation-specific compile-time logic
const operationsIdl = idlReducer.bind(null, processors);

module.exports = {
  operationsIdl,
};
