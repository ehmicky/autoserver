'use strict';

const emitStartEvent = async function ({ apiServer, startupLog }) {
  await apiServer.emitAsync('start');
  // Create log message when all protocol-specific servers have started
  startupLog.log('Server is ready', { type: 'start' });
};

module.exports = {
  emitStartEvent,
};
