'use strict';


const { ExtendableError } = require('./extendable_error');


// Fired when error happens on a specific request
class EngineError extends ExtendableError {

  constructor(message, opts) {
    super(message, Object.assign(opts, {
      allowedOpts: ['reason', 'innererror', 'extra'],
      requiredOpts: ['reason'],
    }));
  }

}


module.exports = {
  EngineError,
};
