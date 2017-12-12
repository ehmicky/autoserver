'use strict';

const { logEvent } = require('../../log');

// Protocol-specific start event
const startEvent = function ({
  protocol: { hostname, port },
  protocolAdapter: { title },
  config,
}) {
  const message = `${title} - Listening on ${hostname}:${port}`;
  return logEvent({ event: 'message', phase: 'startup', message, config });
};

module.exports = {
  startEvent,
};
