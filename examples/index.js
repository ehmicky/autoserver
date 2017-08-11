'use strict';

const { start } = require('../index');

// As this is a global variable, the calling code must modify it, not the engine
// eslint-disable-next-line fp/no-mutation
Error.stackTraceLimit = 100;

const apiServer = start()
  // This is for Nodemon to properly exit.
  // But if several servers are run at once (with or without Nodemon),
  // this will make the first one that finished exiting abrupt the others,
  // which is bad.
  // eslint-disable-next-line semi
  .on('stop.*', () => process.kill(process.pid, 'SIGUSR2'))

  /*
  .on('start.success', () => hasEmit('start.success'))
  .on('start.failure', () => hasEmit('start.failure'))
  .on('stop.success', () => hasEmit('stop.success'))
  .on('stop.failure', () => hasEmit('stop.failure'))
  .on('log.*.*.*', ({ phase, type, level }) =>
    hasEmit(`log.${phase}.${type}.${level}`)
  )
  */

  /*
  .on('*', info => {
    if (info.type === 'perf') { return; }

    const jsonInfo = JSON.stringify(info, null, 2);
    global.console.log('Logging info', jsonInfo);
  })
  */

  /*
  .on('log.*.perf.*', ({ measuresMessage }) => {
    console.log(`Performance logging info\n${measuresMessage}`);
  })
  */

/*
const hasEmit = function (eventName) {
  global.console.log(`Emitting event '${eventName}'`);
};
*/

module.exports = {
  apiServer,
};
