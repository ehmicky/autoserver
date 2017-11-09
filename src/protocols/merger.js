'use strict';

const { keyBy } = require('../utilities');

const handlers = require('./handlers');

// Return object of all protocol-specific functions, as { PROTOCOL: OBJECT }
// Everything that is protocol-specific is in this directory.
// E.g. there should be no HTTP-related code outside of this directory,
// to enforce protocol-agnosticism and separation of concerns.
const protocolHandlers = keyBy(handlers);

module.exports = {
  protocolHandlers,
};
