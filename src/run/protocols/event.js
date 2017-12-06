'use strict';

const { logEvent } = require('../../log');

// Protocol-specific start event
const startEvent = function ({
  protocol: { hostname, port },
  protocolAdapter: { title },
  schema,
}) {
  const message = `${title} - Listening on ${hostname}:${port}`;
  return logEvent({ event: 'message', phase: 'startup', message, schema });
};

module.exports = {
  startEvent,
};
