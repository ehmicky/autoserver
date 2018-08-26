'use strict';

const { inspect } = require('util');
const { stdout: { columns } } = require('process');

const autoserver = require('..');

// Set default console log printing
const setDefaultDebug = function () {
  // eslint-disable-next-line fp/no-mutation
  inspect.defaultOptions = {
    colors: true,
    depth: null,
    breakLength: columns || COLUMNS_WIDTH,
  };
};

const COLUMNS_WIDTH = 80;

const startServer = async function () {
  try {
    const { protocols, exit } = await autoserver.run();
    return { protocols, exit };
  } catch {
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log('Startup error');
  }
};

setDefaultDebug();

startServer();
