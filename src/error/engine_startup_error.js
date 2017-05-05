'use strict';


const { ExtendableError } = require('./extendable_error');


// Fired when error happens on server startup
class EngineStartupError extends ExtendableError {

  constructor(message, opts) {
    // Rename options so it looks the same as other errors when printed on console
    opts.type = opts.reason;
    delete opts.reason;
    const details = opts.innererror && opts.innererror.stack;
    if (details) {
      opts.details = details;
    }
    delete opts.innererror;

    super(message, Object.assign(opts, {
      allowedOpts: ['type', 'details'],
      requiredOpts: ['type'],
    }));
  }

}


module.exports = {
  EngineStartupError,
};
