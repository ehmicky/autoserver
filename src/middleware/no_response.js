'use strict';


const { EngineError } = require('../error');


/**
 * If we got there, it means no response has been fired
 **/
const noResponse = function () {
  return function noResponse() {
    throw new EngineError('No middleware was able to handle the request', {
      reason: 'WRONG_RESPONSE',
    });
  };
};


module.exports = {
  noResponse,
};
