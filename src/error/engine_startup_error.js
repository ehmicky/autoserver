'use strict';


const { ExtendableError } = require('./extendable_error');


class EngineStartupError extends ExtendableError {

  constructor(...args) {
    super(...args);
  }

}


module.exports = {
  EngineStartupError,
};
