'use strict';

const { throwError } = require('../../error');
const { getLimits } = require('../../limits');

// Fill in:
//  - `mInput.url`: full URL, e.g. used for events
//  - `mInput.path`: URL's path, e.g. used by router
// Uses protocol-specific URL retrieval, but are set in a
// protocol-agnostic format, i.e. each protocol sets the same strings.
const parsePath = function ({ protocolHandler, specific, runOpts, origin }) {
  const path = protocolHandler.getPath({ specific });

  validatePath({ path });

  const url = `${origin}${path}`;
  validateUrl({ url, runOpts });

  return { url, path, origin };
};

const validatePath = function ({ path }) {
  if (typeof path === 'string') { return; }

  const message = `'path' must be a string, not '${path}'`;
  throwError(message, { reason: 'SERVER_INPUT_VALIDATION' });
};

const validateUrl = function ({ url, runOpts }) {
  const { maxUrlLength } = getLimits({ runOpts });
  if (url.length <= maxUrlLength) { return; }

  const message = `URL length must be less than ${maxUrlLength} characters`;
  throwError(message, { reason: 'URL_LIMIT' });
};

module.exports = {
  parsePath,
};
