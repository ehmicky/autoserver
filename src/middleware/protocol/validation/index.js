'use strict';


const { validate } = require('../../../validation');
const { EngineError } = require('../../../error');


/**
 * Protocol layer validation
 * Those errors should not happen, i.e. server-side (e.g. 500)
 **/
const protocolValidation = function () {
  return async function protocolValidation(input) {
    const { protocol } = input;

    if (!protocol) {
      const message = 'Unsupported protocol';
      throw new EngineError(message, { reason: 'UNSUPPORTED_PROTOCOL' });
    }

    validate({ schema, data: input, reportInfo });

    const response = await this.next(input);
    return response;
  };
};

const schema = {
  type: 'object',
  required: ['specific', 'jsl', 'protocol', 'protocolFullName'],
  properties: {
    specific: { type: 'object' },
    jsl: { type: 'object' },
    protocol: { type: 'string' },
    protocolFullName: { type: 'string' },
  },
};
const reportInfo = { type: 'serverInputSyntax', dataVar: 'input' };


module.exports = {
  protocolValidation,
};
