'use strict';

const { validateObject } = require('./validate');

const parseHeaders = function ({ protocolAdapter: { getHeaders }, specific }) {
  if (getHeaders === undefined) { return; }

  const headers = getHeaders({ specific });

  validateObject(headers, 'headers');

  return { headers };
};

module.exports = {
  parseHeaders,
};
