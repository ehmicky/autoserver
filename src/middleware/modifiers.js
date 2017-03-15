'use strict';


const { MiddlewareWrapper } = require('./wrapper');


/**
 * Modifiers are functions that can be used to manipulate a chain of middleware.
 * E.g. in chain(test(func, middleware), middleware_2, bind(middleware, context)), test() and bind() are modifiers
 * Modifiers are instances of new MiddlewareModifier({ type: 'TYPE', handler(...) })
 * MiddlewareModifier.type:
 *  - only used as an identifier, e.g. for debugging, or if two types of modifiers want to interact with each other
 *  - is usually the same as the variable name
 * MiddlewareModifier.handler({ middlewares, args, log }):
 *  - `args` are same argument as a middleware function
 *  - `middlewares` is the "list of next middleware" which includes all the coming middleware, but not the modifier itself,
 *    nor the last "placeholder" middleware
 *  - `log` is a regular log function. It is recommended to end the function with a message like 'Ending modifier "TYPE": ...'
 *  - can return a modified "list of next middleware" to modify it, e.g. adding or removing middleware
 *  - can return undefined to signify "no change"
 * Modifiers only have an effect in the current chain(), not in the upper one (in case of nested chain())
 * When creating new middleware functions, should use new MiddlewareWrapper({ type: '...', handler: function }) instead of passing the function
 * directly
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
    handler({ middlewares, log }) {
      const wrapper = new MiddlewareWrapper({ handler: middleware, type: 'bind' });
      wrapper.context = context;
      log(`Ending modifier "${this.type}"`);
      return [wrapper].concat(middlewares);
    },
  });
  return modifier;
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
    handler({ middlewares, args = [], log }) {
      const success = condition(...args);
      log(`Ending modifier "${this.type}": ${success ? 'success' : 'fail'}`);
      return success ? [middleware].concat(middlewares) : middlewares;
    },
  });
  return modifier;
}

/**
* branch(condition, { key: middleware, ... }) modifier
 * Fires condition(...) to return a key. Uses this key to pick the middleware to fire.
 * Can use "default" as key.
 * Equivalent of a `switch` statement
 *
 * @param condition {function}
 * @param map {object} key is the result of the switch statement. value is middleware
 * @returns modifier {MiddlewareModifier}
 **/
const branchModifier = function (condition, map) {
  const modifier = new MiddlewareModifier({
    type: 'branch',
    handler({ middlewares, args = [], log }) {
      const key = condition(...args);
      let middleware = map[key];
      // Default case
      if (!middleware) {
        if (map.default) {
          middleware = map.default;
        } else {
          log(`Ending modifier "${this.type}": no middleware was picked`);
          return middlewares;
        }
      }
      log(`Ending modifier "${this.type}": ${key} was picked`);
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
    handler({ middlewares, args = [], log }) {
      // Stops iteration on repeatEnd(repeatMiddleware)
      let repeatEndIndex = middlewares.findIndex(middleware => {
        return middleware instanceof MiddlewareModifier
          && middleware.type === 'repeatEnd'
          && middleware.repeatMiddleware === repeatMiddleware;
      });
      // If repeatEnd() not found, process until the end
      repeatEndIndex = repeatEndIndex === -1 ? middlewares.length : repeatEndIndex;

      // Process the middlewares that are before repeatEnd(repeatMiddleware)
      const middlewaresBeforeEnd = middlewares.slice(0, repeatEndIndex);
      const newMiddlewares = middlewaresBeforeEnd.reduce((allMiddlewares, middleware) => {
        // Do not add repeat functions before another repeat function
        if (middleware instanceof MiddlewareWrapper && middleware.type === 'repeat') {
          return allMiddlewares.concat(middleware);
        }

        // Do not add repeat functions if provided condition fails
        if (condition && condition(...args)) {
          return allMiddlewares.concat(middleware);
        }

        // Add repeat function
        const wrapper = new MiddlewareWrapper({ handler: repeatMiddleware, type: 'repeat' });
        return allMiddlewares.concat(wrapper, middleware);
      }, []);

      // Adds the middlewares that were after repeatEnd(repeatMiddleware)
      const middlewaresAfterEnd = middlewares.slice(repeatEndIndex + 1);
      log(`Ending modifier "${this.type}": ${newMiddlewares.length - middlewares.length} middlewares were added`);
      return newMiddlewares.concat(middlewaresAfterEnd);
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
  MiddlewareModifier,

  bind: bindModifier,
  test: testModifier,
  branch: branchModifier,
  repeat: repeatModifier,
  repeatEnd: repeatEndModifier,
  repeatUnless: repeatUnlessModifier,
};
