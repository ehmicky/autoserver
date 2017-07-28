'use strict';

const { throwError } = require('../../error');
const { addLogInfo } = require('../../logging');

// Fill in:
//  - `input.url`: full URL, e.g. used for logging
//  - `input.path`: URL's path, e.g. used by router
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
const parseUrl = async function (nextFunc, input) {
  const { protocolHandler, specific } = input;

  const origin = getOrigin({ specific, protocolHandler });
  const path = getPath({ specific, protocolHandler });
  const url = `${origin}${path}`;

  const inputA = addLogInfo(input, { url, path, origin });
  const inputB = { ...inputA, url, path, origin };

  const response = await nextFunc(inputB);
  return response;
};

const getOrigin = function ({ specific, protocolHandler }) {
  const origin = protocolHandler.getOrigin({ specific });

  if (typeof origin !== 'string') {
    const message = `'origin' must be a string, not '${origin}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return origin;
};

const getPath = function ({ specific, protocolHandler }) {
  const path = protocolHandler.getPath({ specific });

  if (typeof path !== 'string') {
    const message = `'path' must be a string, not '${path}'`;
    throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
  }

  return path;
};

module.exports = {
  parseUrl,
};
