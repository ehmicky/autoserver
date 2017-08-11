'use strict';

const { reportLog } = require('../../logging');

const emitStartEvent = async function ({
  servers,
  runtimeOpts,
  startupLog: log,
}) {
  // Create log message when all protocol-specific servers have started
  const message = 'Server is ready';
  const info = { servers, runtimeOpts };
  const startPayload = await reportLog({ log, type: 'start', message, info });
  return { startPayload };
};

module.exports = {
  emitStartEvent,
};
