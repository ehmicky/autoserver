'use strict';

const { emitEvent } = require('../../events');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({ servers, runtimeOpts }) {
  const message = 'Server is ready';
  const info = { servers, runtimeOpts };
  const startPayload = await emitEvent({
    type: 'start',
    phase: 'startup',
    message,
    info,
    runtimeOpts,
  });
  return { startPayload };
};

module.exports = {
  emitStartEvent,
};
