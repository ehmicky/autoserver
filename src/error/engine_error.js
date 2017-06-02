'use strict';


const { difference } = require('lodash');


// Note that any exception thrown in the `error` module might not be logged
// (since this is the error), so we must be precautious.
class EngineError extends Error {

  constructor(message, opts = {}) {
    super(message);

    this.checkSignature(opts);

    this.name = this.constructor.name;

    this.addInnerError(opts);

    this.addStack(message);

    Object.assign(this, opts);
  }

  // Make sure signature is correct
  checkSignature(opts) {
    // Check whitelisted options
    const optsKeys = Object.keys(opts);
    const nonAllowedOpts = difference(optsKeys, allowedOpts);
    if (nonAllowedOpts.length > 0) {
      const message = `Cannot use options ${nonAllowedOpts} when throwing 'EngineError'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    // Check required options
    const missingOpts = difference(requiredOpts, optsKeys);
    if (missingOpts.length > 0) {
      const message = `Must specify options ${missingOpts} when throwing 'EngineError'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }
  }

  // Keep track of innererror
  addInnerError(opts) {
    // Only keep innermost innererror
    const innererror = opts.innererror && opts.innererror.innererror
      ? opts.innererror.innererror
      : opts.innererror;
    if (innererror) {
      // We only keep innererror's stack, so if it does not include the
      // error message, which might be valuable information, prepends it
      const { message, stack = '' } = innererror;
      if (message && stack.indexOf(message) === -1) {
        innererror.stack = `${message}\n${stack}`;
      }

      this.innererror = innererror;
      delete opts.innererror;
    }
  }

  // Adds stack trace
  addStack(message) {
    if (this.stack) { return; }
    // Two possible ways to add this.stack, if not present yet
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      message = typeof message === 'string' ? message : '';
      this.stack = (new Error(message)).stack;
    }
  }

}

const allowedOpts = ['reason', 'innererror', 'extra'];
const requiredOpts = ['reason'];


module.exports = {
  EngineError,
};
