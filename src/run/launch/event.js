'use strict';

const { emitEvent } = require('../../events');

// Protocol-specific start event
const startEvent = async function ({
  serverFacts: { host, port },
  protocol,
  runOpts,
}) {
  const message = `${protocol.toUpperCase()} - Listening on ${host}:${port}`;
  await emitEvent({ type: 'message', phase: 'startup', message, runOpts });
};

module.exports = {
  startEvent,
};
