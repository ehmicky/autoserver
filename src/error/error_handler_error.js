'use strict';


const { ExtendableError } = require('./extendable_error');


// Thrown when request error handler itself fails
class ErrorHandlerError extends ExtendableError {

  constructor(message, opts) {
    // Rename options so it looks the same as other errors when printed on console
    opts.type = opts.reason;
    delete opts.reason;
    opts.details = opts.innererror && opts.innererror.stack;
    delete opts.innererror;
    opts.status = opts.status || 500;

    super(message, Object.assign(opts, {
      allowedOpts: ['type', 'details', 'status'],
      requiredOpts: ['type'],
    }));
  }

}


module.exports = {
  ErrorHandlerError,
};
