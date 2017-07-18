'use strict';

const { assignObject } = require('../utilities');

const handlers = require('./handlers');

// Return object of all protocol-specific methods, as { PROTOCOL: OBJECT }
// Everything that is protocol-specific is in this directory.
// E.g. there should be no HTTP-related code outside of this directory,
// to enforce protocol-agnosticism and separation of concerns.
const getProtocolHandlers = function () {
  return handlers
    .map(handler => ({ [handler.name]: handler }))
    .reduce(assignObject, {});
};

const protocolHandlers = getProtocolHandlers();
const protocols = Object.keys(protocolHandlers);

module.exports = {
  protocolHandlers,
  protocols,
};
