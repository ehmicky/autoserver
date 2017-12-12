'use strict';

const { logEvent } = require('../../log');
const { monitor } = require('../../perf');

// Actual connection
const startConnection = async function ({
  adapter,
  adapter: { connect, check, options },
  config,
}) {
  const connection = await connect({ options, config });

  // Check for data model inconsistencies, and potentially fix them
  if (check !== undefined) {
    check({ options, config, connection });
  }

  await emitStartEvent({ adapter, config });

  return connection;
};

const kStartConnection = monitor(
  startConnection,
  ({ adapter: { name } }) => name,
  'databases',
);

// Database adapter-specific start event
const emitStartEvent = async function ({ adapter: { title }, config }) {
  const message = `${title} - Connection initialized`;
  await logEvent({ event: 'message', phase: 'startup', message, config });
};

module.exports = {
  startConnection: kStartConnection,
};
