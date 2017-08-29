'use strict';

const { assignObject } = require('../../utilities');
const { monitoredReduce } = require('../../perf');

const { getProtocols } = require('./protocols');
const { getRequestHandler } = require('./request_handler');
const { launchServer } = require('./launch');
const { startEvent } = require('./event');

// Launch the servers for each protocol
const launchServers = async function (options) {
  const protocols = getProtocols(options);

  // Make sure all servers are starting concurrently, not serially
  const serverFactsPromises = protocols
    .map(protocol => launchEachServer({ protocol, options }));
  const serverFactsArray = await Promise.all(serverFactsPromises);

  // From [{ protocol: serverFacts }, ...] to { protocol: serverFacts, ... }
  const servers = serverFactsArray.reduce(assignObject, {});

  return { servers };
};

// Launch the server of a given protocol
const launchEachServer = async function ({
  protocol,
  options,
  options: { runOpts, measures },
}) {
  const { serverFacts } = await monitoredReduce({
    funcs: launchers,
    initialInput: { protocol, runOpts, options, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: protocol,
  });
  return { [protocol]: serverFacts };
};

const launchers = [
  getRequestHandler,
  launchServer,
  startEvent,
];

module.exports = {
  launchServers,
};
