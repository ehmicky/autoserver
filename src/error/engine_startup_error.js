'use strict';


const { ExtendableError } = require('./extendable_error');


class EngineStartupError extends ExtendableError {

  constructor(...args) {
    super(...args);
    this.type = 'EngineStartupError';
  }

}


module.exports = {
  EngineStartupError,
};
