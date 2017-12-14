'use strict';

const { mapValues, omit, pSetTimeout } = require('../utilities');
const { logEvent } = require('../log');
const { getDefaultDuration } = require('../perf');
const { getServerinfo } = require('../serverinfo');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({ protocols, config, measures }) {
  const message = 'Server is ready';
  const params = getEventParams({ protocols, config, measures });

  // Let other events finish first
  await pSetTimeout(0, { unref: false });

  await logEvent({
    event: 'start',
    phase: 'startup',
    message,
    params,
    config,
  });

  const startPayload = getStartPayload({ params, config });

  return { startPayload };
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

const getStartPayload = function ({ params: { protocols }, config }) {
  const serverinfo = getServerinfo({ config });

  return { protocols, serverinfo };
};

module.exports = {
  emitStartEvent,
};
