'use strict';

const { pick, omit, mapValues } = require('../../utilities');
const { addGenErrorHandler } = require('../../error');

// Initialize each database connection
const startConnections = async function ({ adapters, adaptersMap, runOpts }) {
  // Should use `options`, not `runOpts.db`
  const runOptsA = omit(runOpts, 'db');

  const connectionsPromises = adapters
    .map(adapter => eStartConnection({ adapter, runOpts: runOptsA }));
  const connections = await Promise.all(connectionsPromises);
  const adaptersA = bindAdapters({ adapters, connections, runOpts: runOptsA });
  const dbAdapters = getDbAdapters({ adapters: adaptersA, adaptersMap });
  return dbAdapters;
};

// Actual connection
const startConnection = function ({ adapter: { connect, options }, runOpts }) {
  return connect({ options, runOpts });
};

const eStartConnection = addGenErrorHandler(startConnection, {
  message: ({ adapter: { type } }) => `Could not connect to database '${type}'`,
  reason: 'DB_ERROR',
});

// Add `options` and `connection` to
// `adapter.find|create|delete|replace|close()` input
const bindAdapters = function ({ adapters, connections, runOpts }) {
  return adapters.map((adapter, index) => bindAdapter({
    adapter,
    connection: connections[index],
    runOpts,
  }));
};

const bindAdapter = function ({
  adapter,
  adapter: { options },
  connection,
  runOpts,
}) {
  const methods = pick(adapter, boundMethodNames);
  const boundMethods = mapValues(
    methods,
    func => boundMethod.bind(null, { func, options, connection, runOpts }),
  );
  return { ...adapter, ...boundMethods };
};

const boundMethodNames = ['find', 'create', 'delete', 'replace', 'close'];

const boundMethod = function ({ func, ...rest }, opts, ...args) {
  return func({ ...opts, ...rest }, ...args);
};

// Returns `{ model: adapter }` map
const getDbAdapters = function ({ adapters, adaptersMap }) {
  return mapValues(
    adaptersMap,
    adapter => getDbAdapter({ adapters, adapter }),
  );
};

const getDbAdapter = function ({ adapters, adapter }) {
  return adapters.find(({ type }) => type === adapter);
};

module.exports = {
  startConnections,
};
