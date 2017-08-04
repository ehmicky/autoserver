'use strict';

const { startServer } = require('../index');

const apiServer = startServer({
  conf: './examples/pet.schema.yml',
  loggerFilter: {
    payload: ({ id }) => id,
    headers: ['host'],
  },
  loggerLevel: 'info',
  maxDataLength: 1000,
  defaultPageSize: 100,
  maxPageSize: 100,
  serverName: 'my-machine',
  http: {
    enabled: true,
    host: 'localhost',
    port: 5001,
  },
})
  .on('error', () => hasEmit('error'))
  .on('start', () => hasEmit('start'))
  .on('stop.success', () => hasEmit('stop.success'))
  .on('stop.fail', () => hasEmit('stop.fail'))
  .on('log.*.*.*', info => {
    const { phase, type, level } = info;
    hasEmit(`log.${phase}.${type}.${level}`);

    if (type !== 'perf') {
      // For debugging
      // const jsonInfo = JSON.stringify(info, null, 2);
      // global.console.log('Logging info', jsonInfo);
    }
  });

  /*
  // For debugging
  .on('log.*.perf.*', ({ measuresMessage }) => {
    console.log(`Performance logging info\n${measuresMessage}`);
  });
  */

const hasEmit = function () {
  // For debugging
  // global.console.log(`Emitting event '${eventName}'`);
};

module.exports = {
  apiServer,
};
