'use strict';


const { console } = require('../utilities');


// Create a fake middleware function, for testing purpose
const createDebugMiddleware = function (label) {
  return function (input = 'input') {
    const nextInput = String(Math.random()).replace('.','');
    console.debug(`[${label}] Starting middleware with input ${nextInput}`);
    const val = this.next(nextInput);
    console.debug(`[${label}] Middleware return value: ${val}`);
    return input;
  };
};

// Add request id to debug messages
const createLog = function (requestId) {
  return function (message, ...args) {
    console.debug(`[chain] [${requestId}] ${message}`, ...args);
  };
};


module.exports = {
  createDebugMiddleware,
  createLog,
};
