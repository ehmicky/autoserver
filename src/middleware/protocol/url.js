'use strict';

const { throwError } = require('../../error');
const { getLimits } = require('../../limits');

// Fill in:
//  - `mInput.url`: full URL, e.g. used for events
//  - `mInput.path`: URL's path, e.g. used by router
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
const parseUrl = function ({ protocolHandler, specific, runOpts }) {
  const origin = getOrigin({ specific, protocolHandler });
  const path = getPath({ specific, protocolHandler });
  const url = `${origin}${path}`;

  validateUrl({ url, runOpts });

  return { url, path, origin };
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

const validateUrl = function ({ url, runOpts }) {
  const { maxUrlLength } = getLimits({ runOpts });
  if (url.length <= maxUrlLength) { return; }

  const message = `URL length must be less than ${maxUrlLength} characters`;
  throwError(message, { reason: 'URL_LIMIT' });
};

module.exports = {
  parseUrl,
};
