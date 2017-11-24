'use strict';

const genericOperators = require('./generic');
const numberOperators = require('./number');
const booleanOperators = require('./boolean');
const stringOperators = require('./string');
const arrayOperators = require('./array');

// All patch operators
const OPERATORS = {
  ...genericOperators,
  ...numberOperators,
  ...booleanOperators,
  ...stringOperators,
  ...arrayOperators,
};

module.exports = {
  OPERATORS,
};
