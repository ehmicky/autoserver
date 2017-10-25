'use strict';

const complexOperators = require('./complex');
const simpleOperators = require('./simple');

// All possibile filter operators
const operators = { ...complexOperators, ...simpleOperators };

module.exports = {
  operators,
};
