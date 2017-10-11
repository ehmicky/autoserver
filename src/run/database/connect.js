'use strict';

const { pick, mapValues } = require('../../utilities');
const { addGenErrorHandler } = require('../../error');

// Initialize each database connection
const startConnections = async function ({ adapters, adaptersMap }) {
  const connectionsPromises = adapters.map(eStartConnection);
  const connections = await Promise.all(connectionsPromises);
  const adaptersA = bindAdapters({ adapters, connections });
  const dbAdapters = getDbAdapters({ adapters: adaptersA, adaptersMap });
  return dbAdapters;
};

// Actual connection
const startConnection = function ({ connect, options }) {
  return connect({ options });
};

const eStartConnection = addGenErrorHandler(startConnection, {
  message: ({ type }) => `Could not connect to database '${type}'`,
  reason: 'DB_ERROR',
});

// Add `options` and `connection` to
// `adapter.find|create|delete|replace|close()` input
const bindAdapters = function ({ adapters, connections }) {
  return adapters.map((adapter, index) => bindAdapter({
    adapter,
    connection: connections[index],
  }));
};

const bindAdapter = function ({ adapter, adapter: { options }, connection }) {
  const methods = pick(adapter, boundMethodNames);
  const boundMethods = mapValues(
    methods,
    func => boundMethod.bind(null, { func, options, connection }),
  );
  return { ...adapter, ...boundMethods };
};

const boundMethodNames = ['find', 'create', 'delete', 'replace', 'close'];

const boundMethod = function ({ func, options, connection }, opts, ...args) {
  return func({ ...opts, options, connection }, ...args);
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
