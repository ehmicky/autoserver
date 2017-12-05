'use strict';

const { emitEvent } = require('../events');
const { mapValues, omit, pSetTimeout } = require('../utilities');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({
  protocols,
  runOpts,
  schema,
  gracefulExit,
  measures,
}) {
  const message = 'Server is ready';
  const vars = getVars({ protocols, runOpts, gracefulExit });
  const { duration } = measures.find(({ category }) => category === 'default');

  // Let other events finish first
  await pSetTimeout(0, { unref: false });

  const startPayload = await emitEvent({
    type: 'start',
    phase: 'startup',
    message,
    vars,
    runOpts,
    schema,
    duration,
  });
  return { startPayload };
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
