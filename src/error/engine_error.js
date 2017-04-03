'use strict';


const { ExtendableError } = require('./extendable_error');


class EngineError extends ExtendableError {

  constructor(...args) {
    super(...args);
  }

}


module.exports = {
  EngineError,
};
