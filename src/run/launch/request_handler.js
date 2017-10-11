'use strict';

const { pick } = require('../../utilities');
const { protocolHandlers } = require('../../protocols');

// Request handler fired on each request
const getRequestHandler = function ({
  protocol,
  options,
  options: { requestHandler },
}) {
  const baseInput = pick(options, baseInputKeys);
  const protocolHandler = protocolHandlers[protocol];
  const baseInputA = { ...baseInput, protocol, protocolHandler };
  const handleRequest = processRequest.bind(null, requestHandler, baseInputA);
  return { handleRequest };
};

const baseInputKeys = [
  'schema',
  'runOpts',
  'varsRef',
  'helpers',
  'serverInfo',
  'dbAdapters',
];

const processRequest = function (requestHandler, baseInput, specific) {
  requestHandler({ ...baseInput, specific });
};

module.exports = {
  getRequestHandler,
};
