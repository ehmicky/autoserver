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

  // Normalize error shape to a "problem detail" (see RFC 7807)
  normalize() {
    if (this.reason) {
      this.type = this.reason;
      delete this.reason;
    }

    if (this.message) {
      this.title = this.message;
    }

    this.details = this.innererror
      ? this.innererror.stack
      : this.stack
        ? this.stack
        : '';
    delete this.innererror;
    delete this.stack;

    if (this.extra) {
      Object.assign(this, this.extra);
      delete this.extra;
    }
  }

}


module.exports = {
  EngineStartupError,
};
