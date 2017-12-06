'use strict';

const { logEvent } = require('../log');
const { mapValues, omit, pSetTimeout } = require('../utilities');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({
  protocols,
  schema,
  gracefulExit,
  measures,
}) {
  const message = 'Server is ready';
  const { duration } = measures.find(({ category }) => category === 'default');
  const vars = getEventVars({ protocols, gracefulExit, duration });

  // Let other events finish first
  await pSetTimeout(0, { unref: false });

  await logEvent({
    event: 'start',
    phase: 'startup',
    message,
    vars,
    schema,
  });
  return { startPayload: vars };
};

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getEventVars = function ({ protocols, gracefulExit, duration }) {
  const protocolsA = mapValues(
    protocols,
    protocol => omit(protocol, ['server', 'protocolHandler']),
  );
  return { protocols: protocolsA, exit: gracefulExit, duration };
};

module.exports = {
  emitStartEvent,
};
