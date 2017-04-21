'use strict';


const { ExtendableError } = require('./extendable_error');


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
