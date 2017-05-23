'use strict';


const { difference } = require('lodash');


class ExtendableError extends Error {

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
    const optsKeys = Object.keys(opts);
    const { allowedOpts, requiredOpts } = opts;
    // Make sure they are not printed in console
    delete opts.allowedOpts;
    delete opts.requiredOpts;
    const otherOpts = ['allowedOpts', 'requiredOpts'];
    // Retrieve child constructor
    const ThisError = this.constructor;

    // Check whitelisted options
    const nonAllowedOpts = difference(optsKeys, [...allowedOpts, ...otherOpts]);
    if (nonAllowedOpts.length > 0) {
      throw new ThisError(`Cannot use options ${nonAllowedOpts} when throwing ${ThisError.name}`, {
        reason: 'WRONG_EXCEPTION',
      });
    }

    // Check required options
    const missingOpts = difference(requiredOpts, optsKeys);
    if (missingOpts.length > 0) {
      throw new ThisError(`Must specify options ${missingOpts} when throwing ${ThisError.name}`, {
        reason: 'WRONG_EXCEPTION',
      });
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
      this.stack = (new Error(message)).stack;
    }
  }

}

module.exports = {
  ExtendableError,
};
