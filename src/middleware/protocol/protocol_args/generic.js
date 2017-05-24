'use strict';


const { omitBy } = require('lodash');


// Transform headers into protocolArgs, for protocol-agnostic headers
const genericFillProtocolArgs = function () {
  return function genericFillProtocolArgs({
    headers: {
      'x-no-output': noOutput,
    },
  }) {
    const protocolArgs = { noOutput };
    const args = omitBy(protocolArgs, val => val === undefined);

    return args;
  };
};


module.exports = {
  genericFillProtocolArgs,
};
