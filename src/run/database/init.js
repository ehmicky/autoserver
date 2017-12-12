'use strict';

const { addAllErrorHandlers } = require('./error');
const { startConnection } = require('./connect');
const { bindAdapters } = require('./bind');

// Initialize each database connection
const initAdapters = async function ({ adapters, config, measures }) {
  const adaptersA = addAllErrorHandlers({ adapters });

  const connectionsPromises = adaptersA
    .map(adapter => startConnection({ adapter, config, measures }));
  const connections = await Promise.all(connectionsPromises);

  const adaptersB = bindAdapters({ adapters: adaptersA, connections, config });

  return adaptersB;
};

module.exports = {
  initAdapters,
};
