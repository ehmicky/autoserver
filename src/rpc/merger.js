'use strict';

const { keyBy } = require('../utilities');

const handlers = require('./handlers');

// Return object of all rpc-specific methods, as { RPC: OBJECT }
// Everything that is rpc-specific is in this directory.
// E.g. there should be no GraphQL-related code outside of this directory,
// to enforce rpc-agnosticism and separation of concerns.
const rpcHandlers = keyBy(handlers);

module.exports = {
  rpcHandlers,
};
