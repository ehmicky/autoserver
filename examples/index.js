'use strict';

const { start } = require('../index');

// As this is a global variable, the calling code must modify it, not the engine
// eslint-disable-next-line fp/no-mutation
Error.stackTraceLimit = 100;

const startServer = async function () {
  try {
    const { runtimeOpts, servers } = await start();
    return { runtimeOpts, servers };
  } catch (error) {}
  // This is for Nodemon to properly exit.
  // But if several servers are run at once (with or without Nodemon),
  // this will make the first one that finished exiting abrupt the others,
  // which is bad.
  // TOFIX
  // .on('stop.*', () => process.kill(process.pid, 'SIGUSR2'))
};

startServer();

module.exports = {
  startServer,
};
