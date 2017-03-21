'use strict';


const { ExtendableError } = require('./extendable_error');


class MiddlewareError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'MiddlewareError';
  }

}


module.exports = {
  MiddlewareError,
};