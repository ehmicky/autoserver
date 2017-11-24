'use strict';

const { addAllErrorHandlers } = require('./error');
const genericOperators = require('./generic');
const numberOperators = require('./number');

// All patch operators
const operators = {
  ...genericOperators,
  ...numberOperators,
};

const OPERATORS = addAllErrorHandlers({ operators });

module.exports = {
  OPERATORS,
};
