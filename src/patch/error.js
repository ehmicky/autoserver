'use strict';

const { OPERATORS } = require('./operators');

// We want to differentiate between errors due to engine bug or wrong config
const getReason = function ({ type }) {
  if (OPERATORS[type] !== undefined) { return 'ENGINE'; }

  return 'CONFIG_RUNTIME';
};

module.exports = {
  getReason,
};
