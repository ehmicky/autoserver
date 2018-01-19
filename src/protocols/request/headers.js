'use strict';

const { validateObject } = require('./validate');

const parseHeaders = function ({
  protocolAdapter,
  protocolAdapter: { getHeaders },
  specific,
}) {
  if (getHeaders === undefined) { return; }

  const headers = getHeaders({ specific });

  validateObject(headers, 'headers', protocolAdapter);

  return { headers };
};

module.exports = {
  parseHeaders,
};
