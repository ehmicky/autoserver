'use strict';

const { startServer } = require('../index');

// As this is a global variable, the calling code must modify it, not the engine
// eslint-disable-next-line fp/no-mutation
Error.stackTraceLimit = 100;

const apiServer = startServer({
  conf: './examples/pet.yml',
  logLevel: 'info',
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
  // This is for Nodemon to properly exit.
  // But if several servers are run at once (with or without Nodemon),
  // this will make the first one that finished exiting abrupt the others,
  // which is bad.
  .on('stop.*', () => process.kill(process.pid, 'SIGUSR2'))
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
