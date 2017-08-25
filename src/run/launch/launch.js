'use strict';

const { protocolHandlers } = require('../../protocols');

// Do the actual server launch
const launchServer = async function ({ protocol, runOpts, handleRequest }) {
  const opts = runOpts[protocol.toLowerCase()];
  const protocolHandler = protocolHandlers[protocol];
  const serverInfo = await protocolHandler.startServer({
    opts,
    runOpts,
    handleRequest,
  });
  return { serverInfo: { ...serverInfo, protocol } };
};

module.exports = {
  launchServer,
};
