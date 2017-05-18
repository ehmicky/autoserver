'use strict';


const { MiddlewareWrapper } = require('./wrapper');
const { flatten, middlewaresSymbol } = require('./nesting');


/**
 * Calls a series of middleware (i.e. plain functions), in order.
 * As opposed to Express middleware, but similarly to Koa, the middleware series is though as a a stack, not a pipe.
 * As opposed to Koa, the `next` function can:
 *  - be done several times per middleware
 *  - take any arguments, and return any value (including promise)
 * The last function calling `this.next()` will actually call a placeholder identity function.
 * Returns a function firing the first (i.e. top-level) middleware.
 * This function can be used itself in other chain(), allowing function composition:
 *  - calling chain(chain(...), chain(...)) is the same as calling chain(..., ...)
 *
 * @param {function|function[]...} middlewares - arguments that are neither functions nor modifiers are ignored
 * @returns {function} trigger
 */
const chain = function (...middlewares) {
  // Allow consumer to input an array instead
  middlewares = middlewares[0] instanceof Array ? middlewares[0] : middlewares;
  // Flatten nested chains
  middlewares = flatten(middlewares)
    // Allow using null or false in input
    // TODO: does not work, as flatten() would throw an exception
    .filter(middleware => typeof middleware === 'function')
    // End of iteration
    .concat(lastMiddleware);

  const bootstrap = createBootstrap(middlewares);
  return bootstrap;
};

// Starts all the middleware
const createBootstrap = function (middlewares) {
  const bootstrapFunc = (...args) => {
    // Create shallow copy, so that each chain invocation does not change other invocations
    const clonedMiddleware = cloneMiddleware(middlewares);
    const state = {
      middlewares: clonedMiddleware,
    };

    const returnValue = callWithContext(state.middlewares[0], state, ...args);

    Promise.resolve(returnValue);

    return returnValue;
  };
  bootstrapFunc[middlewaresSymbol] = middlewares;
  return bootstrapFunc;
};

// Clone list of middleware, to avoid side-effects
const cloneMiddleware = function (middlewares) {
  return middlewares
    // Make sure the array container is a copy
    .slice()
    // Make sure each function itself is not modified
    .map(middleware => {
      return new MiddlewareWrapper({ type: 'generic', handler: middleware });
    });
};

const callWithContext = function (middleware, state, ...args) {
  // Add this.next to next middleware
  const context = createContext(middleware, state);
  // Call next middleware
  const originalFunction = MiddlewareWrapper.getFunction(middleware);
  const returnValue = originalFunction.call(context, ...args);

  Promise.resolve(returnValue);

  return returnValue;
};

// Context bound to every middleware
const createContext = function (middleware, state) {
  // Make sure the context is a new object for each request and each middleware
  const context = Object.assign({}, middleware.context, {
    // Go to next middleware
    next(...args) {
      const currentIndex = state.middlewares.findIndex(mdw => mdw === middleware);
      const next = state.middlewares[currentIndex + 1];

      const returnValue = callWithContext(next, state, ...args);
      return returnValue;
    },
  });
  return context;
};

// Used as last iteration
const lastMiddleware = function lastMiddleware(val) {
  return val;
};


module.exports = {
  chain,
};
