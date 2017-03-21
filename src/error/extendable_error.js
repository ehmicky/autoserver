'use strict';


// Avoid infinite recursion between error module and utilities module
const { isDev } = require('../utilities/is_dev');


class ExtendableError extends Error {

  constructor(message, opts = {}) {
    super(message);
    this.name = this.constructor.name;

    // Adds stack trace
    if (isDev()) {
      if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = (new Error(message)).stack;
      }
    } else {
      delete this.stack;
    }

    Object.assign(this, opts);
  }

}

module.exports = {
  ExtendableError,
};