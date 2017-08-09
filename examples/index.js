'use strict';

const { startServer } = require('../index');

// As this is a global variable, the calling code must modify it, not the engine
// eslint-disable-next-line fp/no-mutation
Error.stackTraceLimit = 100;

const oServerOpts = {
  conf: './examples/pet.yml',
  http: { port: 5001 },
};

const apiServer = startServer(oServerOpts)
  .on('start.success', () => hasEmit('start.success'))
  .on('start.failure', () => hasEmit('start.failure'))
  // This is for Nodemon to properly exit.
  // But if several servers are run at once (with or without Nodemon),
  // this will make the first one that finished exiting abrupt the others,
  // which is bad.
  .on('stop.*', () => process.kill(process.pid, 'SIGUSR2'))
  .on('stop.success', () => hasEmit('stop.success'))
  .on('stop.failure', () => hasEmit('stop.failure'))
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
