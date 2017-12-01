'use strict';

const { reduceAsync } = require('../../utilities');
const { monitor } = require('../../perf');
const { protocolHandlers } = require('../../protocols');

const { getRequestHandler } = require('./request_handler');
const { launchServer } = require('./launch');
const { startEvent } = require('./event');

// Launch the servers for each protocol
const launchProtocols = async function (options) {
  // Make sure all servers are starting concurrently, not serially
  const protocolPromises = Object.values(protocolHandlers)
    .map(protocolHandler => kLaunchEachProtocol(options, protocolHandler));
  const protocolsArray = await Promise.all(protocolPromises);

  const protocols = Object.assign({}, ...protocolsArray);

  return { protocols };
};

// Launch the server of a given protocol
const launchEachProtocol = async function (options, protocolHandler) {
  const { runOpts, schema, measures } = options;
  const initialInput = {
    protocolHandler,
    runOpts,
    schema,
    options,
    measures,
    metadata: {},
  };
  const { protocol } = await reduceAsync(
    launchers,
    (input, func) => func(input),
    initialInput,
    (input, newInput) => ({ ...input, ...newInput }),
  );

  return { [protocolHandler.name]: protocol };
};

const kLaunchEachProtocol = monitor(
  launchEachProtocol,
  (options, { name }) => name,
  'protocols',
);

const launchers = [
  getRequestHandler,
  launchServer,
  startEvent,
];

module.exports = {
  launchProtocols,
};
