'use strict';

const { addAllErrorHandlers } = require('./error');
const numberOperators = require('./number');

// All patch operators
const operators = {
  ...numberOperators,
};

const OPERATORS = addAllErrorHandlers({ operators });

module.exports = {
  OPERATORS,
};
