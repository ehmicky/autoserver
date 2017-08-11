'use strict';

const { reportLog } = require('../../logging');

const emitStartEvent = async function ({ servers, runtimeOpts }) {
  // Create log message when all protocol-specific servers have started
  const message = 'Server is ready';
  const info = { servers, runtimeOpts };
  const startPayload = await reportLog({
    type: 'start',
    phase: 'startup',
    message,
    info,
    runtimeOpts,
  });
  return { startPayload };
};

module.exports = {
  emitStartEvent,
};
