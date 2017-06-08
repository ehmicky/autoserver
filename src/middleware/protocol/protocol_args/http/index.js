'use strict';


const { omitBy } = require('lodash');

const { HTTP: { headers: { parsePrefer } } } = require('../../../../parsing');


// Transform headers into protocolArgs, for HTTP-specific headers
// No protocolArgs should be protocol-specific, i.e. HTTP-specific headers
// are redundant with protocol-agnostic ones.
const httpFillProtocolArgs = function () {
  return function httpFillProtocolArgs({ headers, method }) {
    const protocolArgs = {};

    // When using HEAD, or `Prefer: return=minimal` request header,
    // there should be no output
    const isHead = method === 'HEAD';
    const preferHeader = parsePrefer({ headers });
    const hasMinimalPreference = preferHeader.return === 'minimal';
    if (isHead || hasMinimalPreference) {
      protocolArgs.noOutput = true;
    }

    const args = omitBy(protocolArgs, val => val === undefined);

    return args;
  };
};


module.exports = {
  httpFillProtocolArgs,
};
