'use strict';

const apiEngine = require('../index');

// As this is a global variable, the calling code must modify it, not the engine
// eslint-disable-next-line fp/no-mutation
Error.stackTraceLimit = 100;

const startServer = async function () {
  try {
    const { options, servers } = await apiEngine.run();
    return { options, servers };
  } catch (error) {}
};

startServer();
