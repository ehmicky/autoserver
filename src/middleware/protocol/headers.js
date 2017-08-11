'use strict';

const { throwError } = require('../../error');
const { addLogInfo } = require('../../events');

// Fill in `input.headers` using protocol-specific headers.
// Are set in a protocol-agnostic format, i.e. each protocol sets the same
// object.
// Meant to be used to create (in coming middleware) `input.settings` and
// `input.params`, but can also be used by operation layer as is.
const parseHeaders = async function (nextFunc, input) {
  const { specific, protocolHandler } = input;

  const headers = getHeaders({ specific, protocolHandler });

  const inputA = addLogInfo(input, { headers });
  const inputB = { ...inputA, headers };

  const response = await nextFunc(inputB);
  return response;
};

const getHeaders = function ({ specific, protocolHandler }) {
  const headers = protocolHandler.parseHeaders({ specific });

  if (!headers || headers.constructor !== Object) {
    const message = `'headers' must be an object, not '${headers}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return headers;
};

module.exports = {
  parseHeaders,
};
