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
};

startServer();

module.exports = {
  startServer,
};
