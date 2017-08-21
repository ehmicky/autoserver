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
    async: false,
  });
  return { startPayload };
};

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getPayload = function ({ servers, runtimeOpts }) {
  const serversA = mapValues(servers, serverInfo => omit(serverInfo, 'server'));
  const runtimeOptsA = omit(runtimeOpts, 'idl');
  return { servers: serversA, runtimeOpts: runtimeOptsA };
};

module.exports = {
  emitStartEvent,
};
