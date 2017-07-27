'use strict';

const { reportLog } = require('../logging');

const emitStartEvent = async function ({ apiServer, startupLog: log }) {
  await apiServer.emitAsync('start');
  // Create log message when all protocol-specific servers have started
  const message = 'Server is ready';
  await reportLog({ log, level: 'log', message, info: { type: 'start' } });
};

module.exports = {
  emitStartEvent,
};
