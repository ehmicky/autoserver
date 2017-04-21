'use strict';


/**
 * Functions are not passed bare to the chain, but wrapped in a small class
 * The goal is to avoid modifying the original function, or having side-effects leaking between invocation
 * I.e. one should avoid modifying wrapper.handler
 * When adding new functions to the chain, one should use this class
 */
class MiddlewareWrapper {

  constructor({ type, handler }) {
    if (!type) {
      throw new Error('When creating a middleware wrapper, a type must be specified');
    }
    if (!handler) {
      throw new Error('When creating a middleware wrapper, a handler must be specified');
    }
    Object.assign(this, { type, handler });
  }

  // Unwrap MiddlewareWrapper, if it is a MiddlewareWrapper
  static getFunction(middleware) {
    return middleware instanceof MiddlewareWrapper ? MiddlewareWrapper.getFunction(middleware.handler) : middleware;
  }

}


module.exports = {
  MiddlewareWrapper,
};
