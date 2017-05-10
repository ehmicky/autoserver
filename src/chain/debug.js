'use strict';


const { log } = require('../utilities');


// Create a fake middleware function, for testing purpose
const createDebugMiddleware = function (label) {
  return function (input = 'input') {
    const nextInput = String(Math.random()).replace('.','');
    log.info(`[${label}] Starting middleware with input ${nextInput}`);
    const val = this.next(nextInput);
    log.info(`[${label}] Middleware return value: ${val}`);
    return input;
  };
};

const DEFAULT_COLUMNS_WIDTH = 256;
const width = process.env.COLUMNS || DEFAULT_COLUMNS_WIDTH;

// Add request id to debug messages
const createLog = function (requestId) {
  return function (message) {
    const prefix = `[chain] [${requestId}] `;
    const truncatedMessage = message.substring(0, width - prefix.length);
    log.info(`${prefix}${truncatedMessage}`);
  };
};


module.exports = {
  createDebugMiddleware,
  createLog,
};
