'use strict';

const { reportLog } = require('../../logging');
const { makeImmutableShallow } = require('../../utilities');

const emitStartEvent = async function ({ apiServer, startupLog: log }) {
  makeImmutableShallow(apiServer);

  // Create log message when all protocol-specific servers have started
  const message = 'Server is ready';
  await reportLog({ log, type: 'start', message });
};

module.exports = {
  emitStartEvent,
};
