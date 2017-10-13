'use strict';

const { emitEvent } = require('../../events');

// Protocol-specific start event
const startEvent = async function ({
  serverFacts: { hostname, port },
  protocol,
  runOpts,
}) {
  const message = `${protocol.toUpperCase()} - Listening on ${hostname}:${port}`;
  await emitEvent({ type: 'message', phase: 'startup', message, runOpts });
};

module.exports = {
  startEvent,
};
