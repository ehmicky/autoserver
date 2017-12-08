'use strict';

const { addAllErrorHandlers } = require('./error');
const { startConnection } = require('./connect');
const { bindAdapters } = require('./bind');

// Initialize each database connection
const initAdapters = async function ({ adapters, schema, measures }) {
  const adaptersA = addAllErrorHandlers({ adapters });

  const connectionsPromises = adaptersA
    .map(adapter => startConnection({ adapter, schema, measures }));
  const connections = await Promise.all(connectionsPromises);

  const adaptersB = bindAdapters({ adapters: adaptersA, connections, schema });

  return adaptersB;
};

module.exports = {
  initAdapters,
};
