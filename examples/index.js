'use strict';

const { inspect } = require('util');

const apiengine = require('..');

// Set default console log printing
const setDefaultDebug = function () {
  // eslint-disable-next-line fp/no-mutation
  inspect.defaultOptions = {
    colors: true,
    depth: null,
    breakLength: process.stdout.columns || COLUMNS_WIDTH,
  };

  // eslint-disable-next-line fp/no-mutation
  Error.stackTraceLimit = STACK_TRACE_LIMIT;
};

const COLUMNS_WIDTH = 80;
const STACK_TRACE_LIMIT = 20;

const startServer = async function () {
  try {
    await apiengine.compile();
    const { options, servers, exit } = await apiengine.run();
    return { options, servers, exit };
  } catch (error) {
    const { details, ...rest } = error;
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log(rest);
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log(details);
  }
};

setDefaultDebug();

startServer();
