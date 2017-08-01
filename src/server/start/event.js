'use strict';

const { reportLog } = require('../../logging');
const { emitEventAsync } = require('../../events');
const { makeImmutableShallow } = require('../../utilities');

const emitStartEvent = async function ({ apiServer, startupLog: log }) {
  makeImmutableShallow(apiServer);

  await emitEventAsync({ apiServer, name: 'start' });

  // Create log message when all protocol-specific servers have started
  const message = 'Server is ready';
  await reportLog({ log, level: 'log', message, info: { type: 'start' } });
};

module.exports = {
  emitStartEvent,
};
