'use strict';


const { ExtendableError } = require('./extendable_error');


class EngineError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'EngineError';
  }

}


module.exports = {
  EngineError,
};