'use strict';

// Request handler fired on each request
const getRequestHandler = function ({
  protocolAdapter,
  protocolAdapter: { name: protocol },
  options: { requestHandler, config, dbAdapters },
}) {
  const baseInput = { config, dbAdapters, protocol, protocolAdapter };
  const handleRequest = processRequest.bind(null, requestHandler, baseInput);
  return { handleRequest };
};

const processRequest = function (requestHandler, baseInput, specific) {
  requestHandler({ ...baseInput, metadata: {}, specific });
};

module.exports = {
  getRequestHandler,
};
