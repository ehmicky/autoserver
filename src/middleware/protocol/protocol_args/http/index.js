'use strict';


const { omitBy } = require('lodash');


// Transform headers into protocolArgs, for HTTP-specific headers
// No protocolArgs should be protocol-specific, i.e. HTTP-specific headers
// are redundant with protocol-agnostic ones.
const httpFillProtocolArgs = function () {
  return function httpFillProtocolArgs({
    headers: {
      prefer,
    },
  }) {
    const protocolArgs = {};

    const hasMinimalPreference = prefer === 'return=minimal';
    if (hasMinimalPreference) {
      protocolArgs.noOutput = true;
    }

    const args = omitBy(protocolArgs, val => val === undefined);

    return args;
  };
};


module.exports = {
  httpFillProtocolArgs,
};
