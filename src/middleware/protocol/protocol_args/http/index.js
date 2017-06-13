'use strict';


const { HTTP: { headers: { parsePrefer } } } = require('../../../../parsing');
const { omitBy } = require('../../../../utilities');


// Transform headers into args, for HTTP-specific headers
// No args should be protocol-specific, i.e. HTTP-specific headers
// are redundant with protocol-agnostic ones.
const httpFillProtocolArgs = function () {
  return function httpFillProtocolArgs({ headers }) {
    const protocolArgs = {};

    // When using `Prefer: return=minimal` request header,
    // there should be no output
    const preferHeader = parsePrefer({ headers });
    const hasMinimalPreference = preferHeader.return === 'minimal';
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
