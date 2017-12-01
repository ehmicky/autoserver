'use strict';

const { emitEvent } = require('../../events');

// Protocol-specific start event
const startEvent = async function ({
  server: { hostname, port },
  protocolHandler: { title },
  runOpts,
  schema,
}) {
  const message = `${title} - Listening on ${hostname}:${port}`;
  await emitEvent({
    type: 'message',
    phase: 'startup',
    message,
    runOpts,
    schema,
  });
};

module.exports = {
  startEvent,
};
