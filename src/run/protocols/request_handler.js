'use strict';

const { pick } = require('../../utilities');

// Request handler fired on each request
const getRequestHandler = function ({
  protocolHandler,
  protocolHandler: { name: protocol },
  options,
  options: { requestHandler },
  metadata,
}) {
  const baseInput = pick(options, BASE_INPUT_KEYS);
  const baseInputA = { ...baseInput, protocol, protocolHandler, metadata };
  const handleRequest = processRequest.bind(null, requestHandler, baseInputA);
  return { handleRequest };
};

const BASE_INPUT_KEYS = [
  'schema',
  'runOpts',
  'serverinfo',
  'dbAdapters',
];

const processRequest = function (requestHandler, baseInput, specific) {
  requestHandler({ ...baseInput, specific });
};

module.exports = {
  getRequestHandler,
};
