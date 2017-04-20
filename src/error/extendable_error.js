'use strict';


class ExtendableError extends Error {

  constructor(message, opts = {}) {
    super(message);
    this.name = this.constructor.name;

    // Adds stack trace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }

    Object.assign(this, opts);
  }

}

module.exports = {
  ExtendableError,
};
