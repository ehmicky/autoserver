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
  const serverInfosPromises = protocols
    .map(protocol => launchEachServer({ protocol, options }));
  const serverInfosArray = await Promise.all(serverInfosPromises);

  // From [{ protocol: serverInfo }, ...] to { protocol: serverInfo, ... }
  const servers = serverInfosArray.reduce(assignObject, {});

  return { servers };
};

// Launch the server of a given protocol
const launchEachServer = async function ({
  protocol,
  options,
  options: { runOpts, measures },
}) {
  const { serverInfo } = await monitoredReduce({
    funcs: launchers,
    initialInput: { protocol, runOpts, options, measures },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: protocol,
  });
  return { [protocol]: serverInfo };
};

const launchers = [
  getRequestHandler,
  launchServer,
  startEvent,
];

module.exports = {
  launchServers,
};
