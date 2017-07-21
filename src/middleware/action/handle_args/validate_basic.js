'use strict';

const { EngineError } = require('../../../error');

const validateBasic = function ({ args }) {
  if (!args || args.constructor !== Object) {
    const message = `Invalid 'args': '${args}'`;
    throw new EngineError(message, { reason: 'INPUT_SERVER_VALIDATION' });
  }
};

module.exports = {
  validateBasic,
};
