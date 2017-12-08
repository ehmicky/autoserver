'use strict';

const { logEvent } = require('../../log');
const { monitor } = require('../../perf');

// Actual connection
const startConnection = async function ({
  adapter,
  adapter: { connect, check, options },
  schema,
}) {
  const connection = await connect({ options, schema });

  // Check for data model inconsistencies, and potentially fix them
  if (check !== undefined) {
    check({ options, schema, connection });
  }

  await emitStartEvent({ adapter, schema });

  return connection;
};

const kStartConnection = monitor(
  startConnection,
  ({ adapter: { name } }) => name,
  'databases',
);

// Database adapter-specific start event
const emitStartEvent = async function ({ adapter: { title }, schema }) {
  const message = `${title} - Connection initialized`;
  await logEvent({ event: 'message', phase: 'startup', message, schema });
};

module.exports = {
  startConnection: kStartConnection,
};
