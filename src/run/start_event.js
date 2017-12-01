'use strict';

const { emitEvent } = require('../events');
const { mapValues, omit, pSetTimeout } = require('../utilities');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({
  servers,
  runOpts,
  gracefulExit,
  measures,
}) {
  const message = 'Server is ready';
  const info = getPayload({ servers, runOpts, gracefulExit });
  const { duration } = measures.find(({ category }) => category === 'default');

  // Let other events finish first
  await pSetTimeout(0, { unref: false });

  const startPayload = await emitEvent({
    type: 'start',
    phase: 'startup',
    message,
    info,
    runOpts,
    async: false,
    duration,
  });
  return { startPayload };
};

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getPayload = function ({ servers, gracefulExit }) {
  const serversA = mapValues(
    servers,
    serverFacts => omit(serverFacts, ['server', 'protocolHandler']),
  );
  return { servers: serversA, exit: gracefulExit };
};

module.exports = {
  emitStartEvent,
};
