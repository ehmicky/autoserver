'use strict';

const { logEvent } = require('../../log');

// Protocol-specific start event
const startEvent = function ({
  protocol: { hostname, port },
  protocolHandler: { title },
  schema,
}) {
  const message = `${title} - Listening on ${hostname}:${port}`;
  return logEvent({ type: 'message', phase: 'startup', message, schema });
};

module.exports = {
  startEvent,
};
