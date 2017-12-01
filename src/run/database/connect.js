'use strict';

const { emitEvent } = require('../../events');
const { monitor } = require('../../perf');

// Actual connection
const startConnection = async function ({
  adapter,
  adapter: { connect, check, options },
  schema,
  runOpts,
}) {
  const opts = { options, schema, runOpts };

  const connection = await connect(opts);

  // Check for data model inconsistencies, and potentially fix them
  if (check !== undefined) {
    check({ ...opts, connection });
  }

  emitStartEvent({ adapter, runOpts, schema });

  return connection;
};

const kStartConnection = monitor(
  startConnection,
  ({ adapter: { name } }) => name,
  'databases',
);

// Database adapter-specific start event
const emitStartEvent = async function ({
  adapter: { title },
  runOpts,
  schema,
}) {
  const message = `${title} - Connection initialized`;
  await emitEvent({
    type: 'message',
    phase: 'startup',
    message,
    runOpts,
    schema,
  });
};

module.exports = {
  startConnection: kStartConnection,
};
