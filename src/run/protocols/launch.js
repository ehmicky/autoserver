'use strict';

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

module.exports = {
  launchServer,
};
