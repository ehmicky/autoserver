'use strict';


const console = require('../utilities/console');


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
    .concat(lastMiddleware)
    // Make a copy to avoid the manipulation to modify iteration order
    .slice();

  const state = { middlewares };

  const bootstrap = createBootstrap(state);
  return bootstrap;
};

// Starts all the middleware
const createBootstrap = function (state) {
  return (...args) => {
    console.debug(`Starting chain of ${state.middlewares.length} middleware functions`);
    const returnValue = callWithContext(state.middlewares[0], state, ...args);
    console.debug('Ending middleware chain');
    return returnValue;
  };
};

const callWithContext = function (middleware, state, ...args) {
  // Add this.next to next middleware
  const context = createContext(middleware, state);
  // Call next middleware
  const returnValue = middleware.call(context, ...args);
  return returnValue;
};

// Context bound to every middleware
const createContext = function (middleware, state) {
  const context = Object.assign({}, middleware.__context, {
      // Go to next middleware
      next(...args) {
        const currentIndex = state.middlewares.findIndex(mdw => mdw === middleware);
        const next = state.middlewares[currentIndex + 1];

        if (next instanceof MiddlewareModifier) {
          return applyModifier(next, state, ...args);
        }

        // Truncated function body
        const originalFunction = next.__original ? next.__original : next;
        const functionBody = originalFunction.toString().replace(/\s+/g, ' ').substring(0, 100);
        console.debug(`Starting new middleware ${functionBody}`);
        const returnValue = callWithContext(next, state, ...args);
        console.debug(`Ending new middleware ${functionBody}`);

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

  console.debug(`Executing modifier "${modifier.type}"`);
  // Let modifier decide of the replacement middlewares
  const modifiedMiddlewares = modifier.handler(nextMiddlewares, ...args);
  // modifiers can return undefined to mean "unchanged"
  if (modifiedMiddlewares) {
    // Replace the middlewares
    // The last middleware is kept
    state.middlewares.splice(modifierIndex + 1, nextMiddlewares.length, ...modifiedMiddlewares);
  }

  // Calls next middleware, which might be a modifier itself
  const next = state.middlewares[modifierIndex];
  const context = createContext(next, state);
  const returnValue = context.next(...args);
  return returnValue;
};

// Used as last iteration
const lastMiddleware = function lastMiddleware(val) {
  return val;
};


/**
 * Modifiers are functions that can be used to manipulate a chain of middleware.
 * E.g. in chain(test(func, middleware), middleware_2, bind(middleware, context)), test() and bind() are modifiers
 * Modifiers are instances of new MiddlewareModifier({ type: 'TYPE', handler(...) })
 * MiddlewareModifier.type:
 *  - only used as an identifier, e.g. for debugging, or if two types of modifiers want to interact with each other
 *  - is usually the same as the variable name
 * MiddlewareModifier.handler(...):
 *  - fired with the same argument as a middleware function, with an extra argument in the beginning: the "list of next middleware"
 *  - the "list of next middleware" includes all the coming middleware, but not the modifier itself, nor the last "placeholder" middleware
 *  - can return a modified "list of next middleware" to modify it, e.g. adding or removing middleware
 *  - can return undefined to signify "no change"
 * Modifiers only have an effect in the current chain(), not in the upper one (in case of nested chain())
 * Middleware functions can assign the following properties:
 *  - __context {object}: to change context
 *  - __original {function}: when wrapping a function, assign the original one here, so it gets printed by console.debug() (i.e. not the wrapper)
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
const testModifier = function (condition, middleware) {
  const modifier = new MiddlewareModifier({
    type: 'test',
    handler(middlewares, ...args) {
      return condition(...args) ? [middleware].concat(middlewares) : middlewares;
    },
  });
  return modifier;
}

/**
 * bind(middleware, context) modifier
 * Since chain() changes functions' context, middleware.bind(context) does not work. This modifier fixes that.
 *
 * @param middleware {function}
 * @param context {object}
 * @returns modifier {MiddlewareModifier}
 **/
const bindModifier = function (middleware, context) {
  const modifier = new MiddlewareModifier({
    type: 'bind',
    handler(middlewares) {
      middleware.__context = context;
      return [middleware].concat(middlewares);
    },
  });
  return modifier;
}

/**
 * repeatUnless(condition, middleware) modifier
 * Repeatedly calls middleware before each non-modifier middleware, unless condition does not apply
 * Can be stopped by a repeatEnd(middleware) modified.
 *
 * @param condition {function}
 * @param middleware {function}
 * @param context {object}
 * @returns modifier {MiddlewareModifier}
 **/
const repeatUnlessModifier = function (condition, repeatMiddleware) {
  const modifier = new MiddlewareModifier({
    type: 'repeat',
    handler(middlewares, ...args) {
      const newMiddlewares = [];
      let noMoreRepeat = false;
      middlewares.forEach(middleware => {
        // Stops iteration on repeatEnd(repeatMiddleware)
        if (middleware instanceof MiddlewareModifier
          && middleware.type === 'repeatEnd'
          && middleware.repeatMiddleware === repeatMiddleware) {
          noMoreRepeat = true;
        }

        if (!noMoreRepeat && !middleware.__isRepeat && (!condition || !condition(...args))) {
          // Need to clone function
          const clonedRepeatMiddleware = function (...args) {
            return repeatMiddleware.call(this, ...args);
          };
          clonedRepeatMiddleware.__original = repeatMiddleware;
          clonedRepeatMiddleware.__isRepeat = true;

          newMiddlewares.push(clonedRepeatMiddleware);
        }
        newMiddlewares.push(middleware);
      });
      return newMiddlewares;
    },
  });
  return modifier;
}

const repeatEndModifier = function (repeatMiddleware) {
  const modifier = new MiddlewareModifier({
    type: 'repeatEnd',
    handler() {},
  });
  modifier.repeatMiddleware = repeatMiddleware;
  return modifier;
};

// Same as repeatUnlessModifier, but with no condition
const repeatModifier = repeatUnlessModifier.bind(null, null);


module.exports = {
  chain,
  test: testModifier,
  bind: bindModifier,
  repeat: repeatModifier,
  repeatEnd: repeatEndModifier,
  repeatUnless: repeatUnlessModifier,
};

