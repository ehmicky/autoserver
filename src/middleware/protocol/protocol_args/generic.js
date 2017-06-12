'use strict';


const { omitBy } = require('lodash');

const { EngineError } = require('../../../error');


// Transform headers into protocolArgs, for protocol-agnostic headers
const genericFillProtocolArgs = function () {
  return function genericFillProtocolArgs({
    headers: {
      'x-no-output': noOutput,
    },
  }) {
    if (noOutput !== undefined && typeof noOutput !== 'boolean') {
      const message = `'noOutput' settings must be 'true' or 'false', not '${noOutput}'`;
      throw new EngineError(message, { reason: 'INPUT_VALIDATION' });
    }

    const protocolArgs = { noOutput };
    const args = omitBy(protocolArgs, val => val === undefined);

    return args;
  };
};


module.exports = {
  genericFillProtocolArgs,
};
