'use strict';

const { addGenErrorHandler } = require('../../error');

// Do the actual server launch
const launchServer = async function ({
  protocolHandler,
  protocolHandler: { name: protocol },
  runOpts,
  handleRequest,
}) {
  const opts = runOpts.protocols[protocol];
  const server = await protocolHandler.startServer({
    opts,
    runOpts,
    handleRequest,
  });
  return { protocol: { ...server, protocolHandler } };
};

const eLaunchServer = addGenErrorHandler(launchServer, {
  message: ({ protocolHandler: { title } }) => `Could not start ${title} server`,
  reason: 'PROTOCOL_ERROR',
});

module.exports = {
  launchServer: eLaunchServer,
};
