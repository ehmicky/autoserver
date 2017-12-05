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
  const vars = getVars({ protocols, gracefulExit });
  const { duration } = measures.find(({ category }) => category === 'default');

  // Let other events finish first
  await pSetTimeout(0, { unref: false });

  await logEvent({
    event: 'start',
    phase: 'startup',
    message,
    vars,
    schema,
    duration,
  });
  return { startPayload: vars };
};

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getVars = function ({ protocols, gracefulExit }) {
  const protocolsA = mapValues(
    protocols,
    protocol => omit(protocol, ['server', 'protocolHandler']),
  );
  return { protocols: protocolsA, exit: gracefulExit };
};

module.exports = {
  emitStartEvent,
};
