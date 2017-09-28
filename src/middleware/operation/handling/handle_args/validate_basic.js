'use strict';

const { throwError } = require('../../../../error');

const validateBasic = function ({ args }) {
  if (!args || args.constructor !== Object) {
    const message = `Invalid 'args': '${args}'`;
    throwError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

module.exports = {
  validateBasic,
};
