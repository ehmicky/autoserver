'use strict';

const { mapValues, omit, pSetTimeout } = require('../utilities');
const { logEvent } = require('../log');
const { getDefaultDuration } = require('../perf');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({
  protocols,
  config,
  gracefulExit,
  measures,
}) {
  const message = 'Server is ready';
  const vars = getEventVars({ protocols, gracefulExit, measures });

  // Let other events finish first
  await pSetTimeout(0, { unref: false });

  await logEvent({
    event: 'start',
    phase: 'startup',
    message,
    vars,
    config,
  });
  return { startPayload: vars };
};

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getEventVars = function ({ protocols, gracefulExit, measures }) {
  const protocolsA = mapValues(
    protocols,
    protocol => omit(protocol, ['server', 'protocolAdapter']),
  );

  const duration = getDefaultDuration({ measures });

  return { protocols: protocolsA, exit: gracefulExit, duration };
};

module.exports = {
  emitStartEvent,
};
