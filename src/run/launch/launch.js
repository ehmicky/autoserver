'use strict';

const { addGenErrorHandler } = require('../../error');
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

const eLaunchServer = addGenErrorHandler(launchServer, {
  message: ({ protocol }) => `Could not start ${protocol} server`,
  reason: 'PROTOCOL_ERROR',
});

module.exports = {
  launchServer: eLaunchServer,
};
