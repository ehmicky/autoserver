'use strict';

// Request handler fired on each request
const getRequestHandler = function ({
  protocolAdapter,
  protocolAdapter: { name: protocol },
  options: { requestHandler, schema, runOpts, dbAdapters },
}) {
  const baseInput = { schema, runOpts, dbAdapters, protocol, protocolAdapter };
  const handleRequest = processRequest.bind(null, requestHandler, baseInput);
  return { handleRequest };
};

const processRequest = function (requestHandler, baseInput, specific) {
  requestHandler({ ...baseInput, metadata: {}, specific });
};

module.exports = {
  getRequestHandler,
};
