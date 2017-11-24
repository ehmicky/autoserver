'use strict';

const { addAllErrorHandlers } = require('./error');
const genericOperators = require('./generic');
const numberOperators = require('./number');
const booleanOperators = require('./boolean');
const stringOperators = require('./string');

// All patch operators
const operators = {
  ...genericOperators,
  ...numberOperators,
  ...booleanOperators,
  ...stringOperators,
};

const OPERATORS = addAllErrorHandlers({ operators });

module.exports = {
  OPERATORS,
};
