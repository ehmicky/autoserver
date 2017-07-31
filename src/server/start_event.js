'use strict';

const { reportLog } = require('../logging');
const { emitEventAsync } = require('../events');

const emitStartEvent = async function ({ apiServer, startupLog: log }) {
  await emitEventAsync({ apiServer, name: 'start' });
  // Create log message when all protocol-specific servers have started
  const message = 'Server is ready';
  await reportLog({ log, level: 'log', message, info: { type: 'start' } });
};

module.exports = {
  emitStartEvent,
};
