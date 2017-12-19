'use strict';

const { addGenErrorHandler } = require('../../errors');

// Do the actual server launch
const launchServer = async function ({
  protocolAdapter,
  protocolAdapter: { name: protocol },
  config,
  config: { protocols },
  handleRequest,
}) {
  const opts = protocols[protocol];
  const server = await protocolAdapter.startServer({
    opts,
    config,
    handleRequest,
  });
  return { protocol: { ...server, protocolAdapter } };
};

const eLaunchServer = addGenErrorHandler(launchServer, {
  message: ({ protocolAdapter: { title } }) =>
    `Could not start ${title} server`,
  reason: 'PROTOCOL',
});

module.exports = {
  launchServer: eLaunchServer,
};
