'use strict';


const uuidv4 = require('uuid/v4');

const { createLog } = require('./debug');
const { MiddlewareModifier } = require('./modifiers');
const { MiddlewareWrapper } = require('./wrapper');


/**
 * Calls a series of middleware (i.e. plain functions), in order.
 * As opposed to Express middleware, but similarly to Koa, the middleware series is though as a a stack, not a pipe.
 * As opposed to Koa, the `next` function can:
 *  - be done several times per middleware
 *  - take any arguments, and return any value (including promise)
 * The last function calling `this.next()` will actually call a placeholder identity function.
 * Returns a function firing the first (i.e. top-level) middleware. This function can be used itself in other chain(), allowing function composition.
 *
 * @param middlewares {function|function[]...}: arguments that are neither functions nor modifiers are ignored
 * @returns trigger {function}
 */
const chain = function (...middlewares) {
  // Allow consumer to input an array instead
  middlewares = middlewares[0] instanceof Array ? middlewares[0] : middlewares;
  middlewares = middlewares
    // Allow using null or false in input
    .filter(middleware => typeof middleware === 'function' || middleware instanceof MiddlewareModifier)
    // End of iteration
    .concat(lastMiddleware);

  const bootstrap = createBootstrap(middlewares);
  return bootstrap;
};

// Starts all the middleware
const createBootstrap = function (middlewares) {
  return (...args) => {
    // Create shallow copy, so that each chain invocation does not change other invocations
    const clonedMiddleware = cloneMiddleware(middlewares);
    const requestId = uuidv4();
    const state = {
      middlewares: clonedMiddleware,
      requestId,
      log: createLog(requestId),
    };

    state.log('Starting chain');
    const returnValue = callWithContext(state.middlewares[0], state, ...args);
    Promise.resolve(returnValue).then(() => {
      state.log('Ending chain');
    });
    return returnValue;
  };
};

// Clone list of middleware, to avoid side-effects
const cloneMiddleware = function (middlewares) {
  return middlewares
    // Make sure the array container is a copy
    .slice()
    // Make sure each function itself is not modified
    .map(middleware => {
      if (middleware instanceof MiddlewareModifier) { return middleware; }
      return new MiddlewareWrapper({ type: 'generic', handler: middleware });
    });
};

const callWithContext = function (middleware, state, ...args) {
  if (middleware instanceof MiddlewareModifier) {
    return applyModifier(middleware, state, ...args);
  }

  // Add this.next to next middleware
  const context = createContext(middleware, state);
  // Call next middleware
  const originalFunction = MiddlewareWrapper.getFunction(middleware);
  // Truncated function body
  const functionBody = originalFunction
    .toString()
    .replace(/\s+/g, ' ')
    .substring(0, 100);
  state.log(`Starting middleware ${functionBody}`);
  const returnValue = originalFunction.call(context, ...args);
  Promise.resolve(returnValue).then(() => {
    state.log(`Ending middleware ${functionBody}`);
  });
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

// Apply a modifier, i.e. let it change the list of middlewares following that modifier
const applyModifier = function (modifier, state, ...args) {
  const modifierIndex = state.middlewares.findIndex(mdw => mdw === modifier);
  // Pick all the middlewares after the modifier, excluding the last one
  const nextMiddlewares = state.middlewares
    .slice(modifierIndex + 1, state.middlewares.length - 1);

  state.log(`Starting modifier "${modifier.type}"`);
  // Let modifier decide of the replacement middlewares
  const modifiedMiddlewares = modifier.handler({ middlewares: nextMiddlewares, args, log: state.log });
  // modifiers can return undefined to mean "unchanged"
  if (modifiedMiddlewares) {
    // Replace the middlewares
    // The last middleware is kept
    state.middlewares.splice(modifierIndex + 1, nextMiddlewares.length, ...modifiedMiddlewares);
  }

  // Calls next middleware, which might be a modifier itself
  const next = state.middlewares[modifierIndex + 1];
  const returnValue = callWithContext(next, state, ...args);
  return returnValue;
};

// Used as last iteration
const lastMiddleware = function (val) {
  return val;
};


module.exports = {
  chain,
};
