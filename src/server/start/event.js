'use strict';

const { emitEvent } = require('../../events');
const { mapValues, omit } = require('../../utilities');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({ servers, runtimeOpts }) {
  const message = 'Server is ready';
  const info = getPayload({ servers, runtimeOpts });
  const startPayload = await emitEvent({
    type: 'start',
    phase: 'startup',
    message,
    info,
    runtimeOpts,
  });
  return { startPayload };
};

const getPayload = function ({ servers, runtimeOpts }) {
  // Remove `server` from event payload as it is not serializable
  const serversA = mapValues(servers, serverInfo => omit(serverInfo, 'server'));
  return { servers: serversA, runtimeOpts };
};

module.exports = {
  emitStartEvent,
};
