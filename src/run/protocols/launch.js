'use strict';

const { addGenErrorHandler } = require('../../error');

// Do the actual server launch
const launchServer = async function ({
  protocolAdapter,
  protocolAdapter: { name: protocol },
  schema,
  schema: { protocols },
  handleRequest,
}) {
  const opts = protocols[protocol];
  const server = await protocolAdapter.startServer({
    opts,
    schema,
    handleRequest,
  });
  return { protocol: { ...server, protocolAdapter } };
};

const eLaunchServer = addGenErrorHandler(launchServer, {
  message: ({ protocolAdapter: { title } }) =>
    `Could not start ${title} server`,
  reason: 'PROTOCOL_ERROR',
});

module.exports = {
  launchServer: eLaunchServer,
};
