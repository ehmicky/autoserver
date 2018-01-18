'use strict';

const { inspect } = require('util');
const { stdout: { columns } } = require('process');

const apiengine = require('..');

// Set default console log printing
const setDefaultDebug = function () {
  // eslint-disable-next-line fp/no-mutation
  inspect.defaultOptions = {
    colors: true,
    depth: null,
    breakLength: columns || COLUMNS_WIDTH,
  };

  // eslint-disable-next-line fp/no-mutation
  Error.stackTraceLimit = STACK_TRACE_LIMIT;
};

const COLUMNS_WIDTH = 80;
const STACK_TRACE_LIMIT = 20;

const startServer = async function () {
  try {
    const { protocols, exit } = await apiengine.run();
    return { protocols, exit };
  } catch (error) {
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log('Startup error');
  }
};

setDefaultDebug();

startServer();
