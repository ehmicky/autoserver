'use strict';


const { ExtendableError } = require('./extendable_error');


// Fired when error happens on server startup
class EngineStartupError extends ExtendableError {

  constructor(message, opts) {
    super(message, Object.assign(opts, {
      allowedOpts: ['reason', 'innererror', 'extra'],
      requiredOpts: ['reason'],
    }));
  }

}


module.exports = {
  EngineStartupError,
};
