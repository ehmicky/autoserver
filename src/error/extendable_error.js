'use strict';


const { difference } = require('lodash');


class ExtendableError extends Error {

  constructor(message, opts = {}) {
    super(message);

    this.checkSignature(opts);

    this.name = this.constructor.name;

    // Adds stack trace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }

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
    const nonAllowedOpts = difference(optsKeys, allowedOpts.concat(otherOpts));
    if (nonAllowedOpts.length > 0) {
      throw new ThisError(`Cannot use options ${nonAllowedOpts} when throwing ${ThisError.name}`, {
        type: 'WRONG_EXCEPTION',
      });
    }

    // Check required options
    const missingOpts = difference(requiredOpts, optsKeys);
    if (missingOpts.length > 0) {
      throw new ThisError(`Must specify options ${missingOpts} when throwing ${ThisError.name}`, {
        type: 'WRONG_EXCEPTION',
      });
    }
  }

}

module.exports = {
  ExtendableError,
};
