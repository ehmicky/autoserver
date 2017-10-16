'use strict';

const { assignObject, reduceAsync } = require('../../utilities');
const { monitor } = require('../../perf');

const { getProtocols } = require('./protocols');
const { getRequestHandler } = require('./request_handler');
const { launchServer } = require('./launch');
const { startEvent } = require('./event');

// Launch the servers for each protocol
const launchServers = async function (options) {
  const protocols = getProtocols(options);

  // Make sure all servers are starting concurrently, not serially
  const serverFactsPromises = protocols
    .map(protocol => kLaunchEachServer(options, protocol));
  const serverFactsArray = await Promise.all(serverFactsPromises);

  // From [{ protocol: serverFacts }, ...] to { protocol: serverFacts, ... }
  const servers = serverFactsArray.reduce(assignObject, {});

  return { servers };
};

// Launch the server of a given protocol
const launchEachServer = async function (options, protocol) {
  const { runOpts, measures } = options;
  const initialInput = { protocol, runOpts, options, measures };
  const { serverFacts } = await reduceAsync(
    launchers,
    (input, func) => func(input),
    initialInput,
    (input, newInput) => ({ ...input, ...newInput }),
  );

  return { [protocol]: serverFacts };
};

const kLaunchEachServer = monitor(
  launchEachServer,
  (options, protocol) => protocol,
  'servers',
);

const launchers = [
  getRequestHandler,
  launchServer,
  startEvent,
];

module.exports = {
  launchServers,
};
