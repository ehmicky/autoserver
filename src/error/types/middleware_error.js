'use strict';


const { ExtendableError } = require('../../utilities');


class MiddlewareError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'MiddlewareError';
  }

}

// See error_handler for explanation on each error type
MiddlewareError.reasons = [
  'NO_RESPONSE',
];


module.exports = {
  MiddlewareError,
};