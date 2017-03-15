'use strict';


const console = require('../utilities/console');


// Create a fake middleware function, for testing purpose
const createDebugMiddleware = function (label) {
  return function (input = 'input') {
    const nextInput = String(Math.random()).replace('.','');
    console.log(`[${label}] Starting middleware with input ${nextInput}`);
    const val = this.next(nextInput);
    console.log(`[${label}] Middleware return value: ${val}`);
    return input;
  };
};


module.exports = {
  createDebugMiddleware,
};
