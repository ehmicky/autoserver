'use strict';

const { mapValues, omit, pSetTimeout } = require('../utilities');
const { logEvent } = require('../log');
const { getDefaultDuration } = require('../perf');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({ protocols, config, measures }) {
  const message = 'Server is ready';
  const params = getEventParams({ protocols, measures });

  // Let other events finish first
  await pSetTimeout(0, { unref: false });

  await logEvent({
    event: 'start',
    phase: 'startup',
    message,
    params,
    config,
  });
  return { startPayload: params };
};

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getEventParams = function ({ protocols, measures }) {
  const protocolsA = mapValues(
    protocols,
    protocol => omit(protocol, ['server', 'protocolAdapter']),
  );

  const duration = getDefaultDuration({ measures });

  return { protocols: protocolsA, duration };
};

module.exports = {
  emitStartEvent,
};
