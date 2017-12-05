'use strict';

const { emitEvent } = require('../../events');

// Protocol-specific start event
const startEvent = function ({
  protocol: { hostname, port },
  protocolHandler: { title },
  schema,
}) {
  const message = `${title} - Listening on ${hostname}:${port}`;
  return emitEvent({ type: 'message', phase: 'startup', message, schema });
};

module.exports = {
  startEvent,
};
