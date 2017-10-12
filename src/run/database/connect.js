'use strict';

const { pick, omit, mapValues } = require('../../utilities');
const { addGenErrorHandler } = require('../../error');

// Initialize each database connection
const startConnections = async function ({
  adapters,
  adaptersMap,
  schema,
  runOpts,
}) {
  // Should use `options`, not `runOpts.db`
  const runOptsA = omit(runOpts, 'db');

  const connectionsPromises = adapters
    .map(adapter => eStartConnection({ adapter, schema, runOpts: runOptsA }));
  const connections = await Promise.all(connectionsPromises);
  const adaptersA = bindAdapters({
    adapters,
    connections,
    schema,
    runOpts: runOptsA,
  });
  const dbAdapters = getDbAdapters({ adapters: adaptersA, adaptersMap });
  return dbAdapters;
};

// Actual connection
const startConnection = function ({
  adapter: { connect, options },
  schema,
  runOpts,
}) {
  return connect({ options, schema, runOpts });
};

const eStartConnection = addGenErrorHandler(startConnection, {
  message: ({ adapter: { type } }) => `Could not connect to database '${type}'`,
  reason: 'DB_ERROR',
});

// Add `options` and `connection` to
// `adapter.find|create|delete|replace|disconnect()` input
const bindAdapters = function ({ adapters, connections, schema, runOpts }) {
  return adapters.map((adapter, index) => bindAdapter({
    adapter,
    options: adapter.options,
    connection: connections[index],
    schema,
    runOpts,
  }));
};

const bindAdapter = function ({ adapter, ...rest }) {
  const methods = pick(adapter, boundMethodNames);
  const boundMethods = mapValues(
    methods,
    func => boundMethod.bind(null, { func, ...rest }),
  );
  return { ...adapter, ...boundMethods };
};

const boundMethodNames = ['find', 'create', 'delete', 'replace', 'disconnect'];

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
