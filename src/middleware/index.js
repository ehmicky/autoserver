'use strict';

/*
TODO: modifiers:
  - bind(MFUNC, this)->MFUNC2: bind context, since chain() rebinds context. If this.next() already exists, uses this._next instead.
  - repeat(MFUNC)->MFUNC2: repeat accross the chain, e.g. chain(repeat(a), b, c, repeat(d), e, f) -> chain(a, b, a, c, a, d, e, a, d, f)
*/

const console = require('../utilities/console');


/*
const newFunc = function (label) {
  return function (input = 'input') {
    const nextInput = String(Math.random()).replace('.','');
    console.log(`[${label}] Start with input ${nextInput}`);
    const val = this.next(nextInput);
    console.log(`[${label}] Return: ${val}`);
    return input;
  };
};

const alwaysFalse = function () {
  return false;
};

setTimeout(function () {
  chain(
    newFunc('one'),
    newFunc('two'),
    testFunc(alwaysFalse, function () {
      return this.next('yo');
    }),
    newFunc('three')
  )();
}, 0);
*/


/**
 * Calls a series of middleware (i.e. plain functions), in order.
 * As opposed to Express middleware, but similarly to Koa, the middleware series is though as a a stack, not a pipe.
 * As opposed to Koa, the `next` function can:
 *  - be done several times per middleware
 *  - take any arguments, and return any value (including promise)
 * The last function calling `this.next()` will actually call a placeholder identity function.
 * Returns a function firing the first (i.e. top-level) middleware. This function can be used itself in other chain(), allowing function composition.
 *
 * @param rawMiddlewares {function|function[]...}: non-function arguments are ignored
 * @returns trigger {function}
 */
const chain = function (...middlewares) {
  // Allow consumer to input an array instead
  middlewares = middlewares[0] instanceof Array ? middlewares[0] : middlewares;

  middlewares = middlewares
    // Allow using null or false in input
    .filter(middleware => typeof middleware === 'function' || middleware instanceof MiddlewareModifier);

  // Make a copy to avoid the manipulation to modify iteration order
  let processedMiddlewares = middlewares.slice();
  middlewares
    // Apply modifiers
    .forEach(middleware => {
      if (!middleware instanceof MiddlewareModifier || !middleware.handler) { return; }
      const currentIndex = processedMiddlewares.findIndex(mdw => mdw === middleware);
      // A previous modifier might have deleted this modifier
      if (!currentIndex) { return; }
      // If returning undefined, do not modify anything
      processedMiddlewares = middleware.handler(processedMiddlewares, currentIndex) || processedMiddlewares;
    });

  middlewares = processedMiddlewares
    // Remove modifiers
    .filter(middleware => !(middleware instanceof MiddlewareModifier))
    // Flag middleware that were added by modifiers
    .map(middleware => {
      middleware.isInput = middlewares.includes(middleware);
      return middleware;
    })
    // End of iteration function
    .concat(lastMiddleware)
    // Iterate from last to first
    .reverse()
    // Each middleware point to the next using function.__nextMiddleware
    .map((middleware, index, allMiddlewares) => {
      // Binds this.next()
      const boundMiddleware = bindContext(middleware);
      // Remember unbounded function, for debugging purpose
      boundMiddleware.original = middleware;

      // Build the chain
      const previousMiddleware = allMiddlewares[index + 1];
      if (previousMiddleware) {
        previousMiddleware.__nextMiddleware = boundMiddleware;
      }

      return boundMiddleware;
    })
    // Put back to normal order
    .reverse();

  // Starts all the middleware
  const bootstrap = createBootstrap(middlewares);

  return bootstrap;
};

// Context bound to every middleware
const bindContext = function (middleware) {
  const context = {
      // Go to next middleware
      next(...args) {
        return this.__go(1, ...args);
      },
      // Go the nth next middleware. Only used by modifiers
      __go(offset, ...args) {
        let nextMiddleware = middleware;
        for (let i = 0; i < offset; i++) {
          nextMiddleware = nextMiddleware.__nextMiddleware || nextMiddleware.original.__nextMiddleware || nextMiddleware;
        }
        // Do not console.debug() the middleware that were added by modifiers
        if (middleware.isInput) {
          console.debug(`Starting new middleware ${nextMiddleware.original.toString().substring(0, 100)}`);
        }
        // Call next middleware
        const returnValue = nextMiddleware(...args);
        if (middleware.isInput) {
          console.debug(`Ending middleware ${nextMiddleware.original.toString().substring(0, 100)}`);
        }
        return returnValue;
      },
  };
  return middleware.bind(context);
};

// Starts all the middleware
const createBootstrap = function (middlewares) {
  return (...args) => {
    console.debug(`Starting chain of ${middlewares.length} middleware functions`);
    const returnValue = middlewares[0](...args);
    console.debug('Ending middleware chain');
    return returnValue;
  };
};

// Used as last iteration
const lastMiddleware = function lastMiddleware(val) {
  return val;
};


/**
 * Modifiers are functions that can be used to manipulate a chain of middleware.
 * E.g. in chain(test(func, middleware), middleware_2, bind(middleware, context)), test() and bind() are modifiers
 * Modifiers are functions that:
 *  - take any argument
 *  - return a new MiddlewareModifier({ type: 'TYPE', handler(...) })
 * MiddlewareModifier.type:
 *  - only used as an identifier, e.g. if two types of modifiers want to interact with each other
 *  - is usually the same as the variable name
 * MiddlewareModifier.handler(...):
 *  - takes the middleware list as first argument, and returns it modified or not. One can remove or add middleware functions.
 *     - the middleware list is flattened as a single array
 *     - the middleware list include the modifiers themselves
 *     - if a modifier modifies the middleware list, the next modifiers will still receive the modified list as input
 *     - if a modifier removes another one from the list, that modifier won't be fired
 *     - items are iterated using a copy of the original/unchanged middleware list. I.e. modifying it will not change iteration.
 *  - returning undefined is the same as returning the middleware list unchanged
 *  - modifiers also take their position in the (modified) middleware list as second argument
 *  - added middleware functions are regular, except they can:
 *     - use this.__go(number, ...), which is the same as this.skip(...) but can skip several middleware functions
 * Modifiers only have an effect in the current chain(), not in the upper one (in case of nested chain())
 */
class MiddlewareModifier {

  constructor({ type, handler }) {
    if (!type) {
      throw new Error('When creating a middleware modifier, a type must be specified');
    }
    if (!handler) {
      throw new Error('When creating a middleware modifier, a handler must be specified');
    }
    Object.assign(this, { type, handler })
  }

}

/**
 * test(condition, middleware) modifier
 * Only uses middleware if condition(...) returns true, passing the same arguments that middleware function would receive
 *
 * @param condition {function}
 * @param middleware {function}
 * @returns modifier {MiddlewareModifier}
 **/
const testFunc = function (condition, middleware) {
  const handler = (middlewares, index) => {
    const jumpFunc = createJumpFunc(condition);
    middlewares.splice(index, 0, jumpFunc, middleware);
    return middlewares;
  };
  const modifier = new MiddlewareModifier({
    type: 'test',
    handler,
  });
  return modifier;
}

const createJumpFunc = function(condition) {
  return function (...args) {
    if (condition(...args)) {
      this.next(...args);
    } else {
      this.__go(2, ...args);
    }
  };
};


module.exports = {
  chain,
  test: testFunc,
};

