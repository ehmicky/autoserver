'use strict';

const { protocolHandlers } = require('../../protocols');

// Do the actual server launch
const launchServer = async function ({ protocol, runOpts, handleRequest }) {
  const opts = runOpts[protocol.toLowerCase()];
  const protocolHandler = protocolHandlers[protocol];
  const serverFacts = await protocolHandler.startServer({
    opts,
    runOpts,
    handleRequest,
  });
  return { serverFacts: { ...serverFacts, protocol } };
};

module.exports = {
  launchServer,
};
