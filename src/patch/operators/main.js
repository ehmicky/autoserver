'use strict';

const genericOperators = require('./generic');
const numberOperators = require('./number');
const booleanOperators = require('./boolean');
const stringOperators = require('./string');
const arrayOperators = require('./array');
const sliceOperators = require('./slice');

// All patch operators
const OPERATORS = {
  ...genericOperators,
  ...numberOperators,
  ...booleanOperators,
  ...stringOperators,
  ...arrayOperators,
  ...sliceOperators,
};

module.exports = {
  OPERATORS,
};
