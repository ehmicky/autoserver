'use strict';

const { monitor } = require('../perf');
const { logEvent } = require('../log');
const { PROTOCOLS, getProtocol } = require('../protocols');

// Launch the server for each protocol
const launchProtocols = async function (options) {
  // Make sure all servers are starting concurrently, not serially
  const protocolPromises = PROTOCOLS
    .map(protocol => kLaunchProtocol(options, protocol));
  const protocolsArray = await Promise.all(protocolPromises);

  const protocolAdaptersA = Object.assign({}, ...protocolsArray);
  return { protocolAdapters: protocolAdaptersA };
};

// Launch the server of a given protocol
const launchProtocol = async function (options, protocol) {
  const protocolAdapter = getProtocol(protocol);
  const { protocolAdapter: protocolAdapterA } = await launchServer({
    protocolAdapter,
    options,
  });

  return { [protocolAdapterA.name]: protocolAdapterA };
};

const kLaunchProtocol = monitor(
  launchProtocol,
  (options, name) => name,
  'protocols',
);

// Do the actual server launch
const launchServer = async function ({
  protocolAdapter,
  protocolAdapter: { name: protocol },
  options: { config, config: { protocols }, dbAdapters, requestHandler },
}) {
  const getRequestInput = getInput.bind(null, { config, dbAdapters });
  const opts = protocols[protocol];
  const protocolAdapterA = await protocolAdapter.startServer({
    requestHandler,
    getRequestInput,
    opts,
    config,
  });

  await startEvent({ protocolAdapter: protocolAdapterA, config });

  return { protocolAdapter: protocolAdapterA };
};

const getInput = function ({ config, dbAdapters }) {
  // We need to recreate `metadata` for each request
  return { config, dbAdapters, metadata: {} };
};

// Protocol-specific start event
const startEvent = function ({
  protocolAdapter: { title, info: { hostname, port } },
  config,
}) {
  const message = `${title} - Listening on ${hostname}:${port}`;
  return logEvent({ event: 'message', phase: 'startup', message, config });
};

module.exports = {
  launchProtocols,
};
