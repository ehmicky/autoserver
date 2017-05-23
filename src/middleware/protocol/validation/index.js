'use strict';


const { validate } = require('../../../validation');
const { EngineError } = require('../../../error');


/**
 * Protocol layer validation
 * Those errors should not happen, i.e. server-side (e.g. 500)
 **/
const protocolValidation = function () {
  return function protocolValidation(input) {
    const { protocol } = input;
    if (!protocol) {
      const message = 'Unsupported protocol';
      throw new EngineError(message, { reason: 'UNSUPPORTED_PROTOCOL' });
    }

    validate({ schema, data: input, reportInfo });

    const response = this.next(input);
    return response;
  };
};

const schema = {
  type: 'object',
  required: ['specific', 'jsl'],
  properties: {
    specific: { type: 'object' },
    jsl: { type: 'object' },
  },
};
const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };


module.exports = {
  protocolValidation,
};
