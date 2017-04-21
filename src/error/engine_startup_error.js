'use strict';


const { ExtendableError } = require('./extendable_error');


class EngineStartupError extends ExtendableError {

  constructor(message, opts) {
    super(message, Object.assign(opts, {
      allowedOpts: ['type', 'details'],
      requiredOpts: ['type'],
    }));
  }

}


module.exports = {
  EngineStartupError,
};
