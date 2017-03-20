'use strict';


const { ExtendableError } = require('../../utilities');


class MiddlewareError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'MiddlewareError';
  }

}


module.exports = {
  MiddlewareError,
};