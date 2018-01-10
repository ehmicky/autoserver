'use strict';

const { mapValues, omit, pSetTimeout } = require('../utilities');
const { logEvent } = require('../log');
const { getDefaultDuration } = require('../perf');
const { getServerinfo } = require('../serverinfo');

// Create event when all protocol-specific servers have started
const emitStartEvent = async function ({ protocolAdapters, config, measures }) {
  // Let other events finish first
  await pSetTimeout(0, { unref: false });

  const message = 'Server is ready';
  const params = getEventParams({ protocolAdapters, config, measures });
  await logEvent({ event: 'start', phase: 'startup', message, params, config });

  const startPayload = getStartPayload({ params, config });

  return { startPayload };
};

// Remove some properties from event payload as they are not serializable,
// or should not be made immutable
const getEventParams = function ({ protocolAdapters, measures }) {
  const protocols = mapValues(
    protocolAdapters,
    ({ info }) => omit(info, ['server']),
  );

  const duration = getDefaultDuration({ measures });

  return { protocols, duration };
};

const getStartPayload = function ({ params: { protocols }, config }) {
  const serverinfo = getServerinfo({ config });

  return { protocols, serverinfo };
};

module.exports = {
  emitStartEvent,
};
