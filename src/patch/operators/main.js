'use strict';

const { addAllErrorHandlers } = require('./error');
const genericOperators = require('./generic');
const numberOperators = require('./number');
const booleanOperators = require('./boolean');

// All patch operators
const operators = {
  ...genericOperators,
  ...numberOperators,
  ...booleanOperators,
};

const OPERATORS = addAllErrorHandlers({ operators });

module.exports = {
  OPERATORS,
};
