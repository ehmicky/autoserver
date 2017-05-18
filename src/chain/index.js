'use strict';


/**
 * Calls a series of middleware (i.e. plain functions), in order.
 * As opposed to Express middleware, but similarly to Koa, the middleware series is though as a a stack, not a pipe.
 * As opposed to Koa, the `next` function can:
 *  - be done several times per middleware
 *  - take any arguments, and return any value (including promise)
 * The last function calling `this.next()` will actually call a placeholder identity function.
 * Returns a function firing the first (i.e. top-level) middleware.
 *
 * @param {function[]} middlewares - arguments that are not functions
 *                                   are ignored
 * @returns {function} trigger
 */
const chain = function (middlewares) {
  middlewares = middlewares
    // Allow using null or false in input
    .filter(middleware => typeof middleware === 'function')
    // End of iteration
    .concat(lastMiddleware);

  // Starts all middleware
  return async function bootstrapFunc(...args) {
    return await callWithContext(middlewares[0], middlewares, ...args);
  };
};

const callWithContext = async function (middleware, middlewares, ...args) {
  // Add this.next to next middleware
  const context = createContext(middleware, middlewares);
  // Call next middleware
  return await middleware.call(context, ...args);
};

// Context bound to every middleware
const createContext = function (middleware, middlewares) {
  return {
    // Go to next middleware
    async next(...args) {
      const currentIndex = middlewares.findIndex(mdw => mdw === middleware);
      const next = middlewares[currentIndex + 1];

      return await callWithContext(next, middlewares, ...args);
    },
  };
};

// Used as last iteration
const lastMiddleware = function lastMiddleware(val) {
  return val;
};


module.exports = {
  chain,
};
