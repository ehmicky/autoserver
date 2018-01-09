'use strict';

const { logEvent } = require('../../log');
const { monitor } = require('../../perf');

// Start each database connection
const startConnections = async function ({ dbAdapters, config, measures }) {
  const dbAdaptersPromises = dbAdapters
    .map(dbAdapter => kStartConnection({ dbAdapter, config, measures }));
  const dbAdaptersA = await Promise.all(dbAdaptersPromises);
  return dbAdaptersA;
};

const startConnection = async function ({
  dbAdapter: { name, title, connect },
  config,
  config: { databases },
}) {
  const options = databases[name];

  const dbAdapter = await connect({ options, config });

  await emitStartEvent({ title, config });

  return dbAdapter;
};

const kStartConnection = monitor(
  startConnection,
  ({ dbAdapter: { name } }) => name,
  'databases',
);

// Database adapter-specific start event
const emitStartEvent = async function ({ title, config }) {
  const message = `${title} - Connection initialized`;
  await logEvent({ event: 'message', phase: 'startup', message, config });
};

module.exports = {
  startConnections,
};
