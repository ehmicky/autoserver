'use strict';


const { MiddlewareWrapper } = require('./wrapper');
const { flatten } = require('./nesting');


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
 * When creating new middleware functions, should use new MiddlewareWrapper({ type: '...', handler: function }) instead of passing the function
 * directly
 * When modifier take a middleware function as argument, it is good practice to allow an array of middleware functions as well
 */
class MiddlewareModifier {

  constructor({ type, handler }) {
    if (!type) {
      throw new Error('When creating a middleware modifier, a type must be specified');
    }
    if (!handler) {
      throw new Error('When creating a middleware modifier, a handler must be specified');
    }
    Object.assign(this, { type, handler });
  }

}

/**
 * bind(middleware, context) modifier
 * Since chain() changes functions' context, middleware.bind(context) does not work. This modifier fixes that.
 *
 * @param {function|function[]} middleware
 * @param {object} context
 * @returns {MiddlewareModifier} modifier
 **/
const bindModifier = function (middleware, context) {
  const modifier = new MiddlewareModifier({
    type: 'bind',
    handler({ middlewares, log }) {
      const middlewareArray = flatten(middleware);
      const wrappers = middlewareArray.map(handler => {
        const wrapper = new MiddlewareWrapper({ handler, type: 'bind' });
        wrapper.context = context;
        return wrapper;
      });
      log(`Ending modifier "${this.type}"`);
      return wrappers.concat(middlewares);
    },
  });
  return modifier;
};

/**
 * test(condition, middleware) modifier
 * Only uses middleware if condition(...) returns true, passing the same arguments that middleware function would receive
 *
 * @param {function} condition
 * @param {function|function[]} middleware
 * @returns {MiddlewareModifier} modifier
 **/
const testModifier = function (condition, middleware) {
  const conditionalMiddleware = flatten(middleware);
  const modifier = new MiddlewareModifier({
    type: 'test',
    handler({ middlewares, args = [], log }) {
      const success = condition(...args);
      log(`Ending modifier "${this.type}": ${success ? 'success' : 'fail'}`);
      return success ? conditionalMiddleware.concat(middlewares) : middlewares;
    },
  });
  return modifier;
};

/**
* branch(condition, { key: middleware, ... }) modifier
 * Fires condition(...) to return a key. Uses this key to pick the middleware to fire.
 * Can use "default" as key.
 * Equivalent of a `switch` statement
 *
 * @param {function} condition
 * @param {object} map - key is the result of the switch statement. value is middleware|middleware[]
 * @returns {MiddlewareModifier} modifier
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
      middleware = flatten(middleware);
      return middleware.concat(middlewares);
    },
  });
  return modifier;
};

/**
 * repeatUnless(condition, middleware) modifier
 * Repeatedly calls middleware before each non-modifier middleware, unless condition does not apply
 * Can be stopped by a repeatEnd(middleware) modified.
 *
 * @param {function} condition
 * @param {function|function[]} middleware
 * @param {object} context
 * @returns {MiddlewareModifier} modifier
 **/
const repeatUnlessModifier = function (condition, repeatMiddleware) {
  const modifier = new MiddlewareModifier({
    type: 'repeat',
    handler({ middlewares, args = [], log }) {
      const repeatMiddlewares = flatten(repeatMiddleware);

      // Stops iteration on repeatEnd(repeatMiddleware)
      // TODO: repeatEnd(a) after repeat([a,b]) stops both a and b. It should only stop a
      let repeatEndIndex = middlewares.findIndex(middleware => middleware instanceof MiddlewareModifier
          && middleware.type === 'repeatEnd'
          && repeatMiddlewares.includes(middleware.repeatMiddleware));
      // If repeatEnd() not found, process until the end
      repeatEndIndex = repeatEndIndex === -1 ? middlewares.length : repeatEndIndex;

      // Process the middlewares that are before repeatEnd(repeatMiddleware)
      const middlewaresBeforeEnd = middlewares.slice(0, repeatEndIndex);
      const newMiddlewares = middlewaresBeforeEnd.reduce((allMiddlewares, middleware) => {
        // Do not add repeat functions before another repeat function
        if (middleware instanceof MiddlewareWrapper && ['repeat', 'repeatEnd'].includes(middleware.type)) {
          return allMiddlewares.concat(middleware);
        }

        // Do not add repeat functions if provided condition fails
        if (condition && condition(...args)) {
          return allMiddlewares.concat(middleware);
        }

        // Add repeat function
        const wrappers = repeatMiddlewares
          .map(handler => new MiddlewareWrapper({ handler, type: 'repeat' }))
          .concat(middleware);
        return allMiddlewares.concat(wrappers);
      }, []);

      // Adds the middlewares that were after repeatEnd(repeatMiddleware)
      const middlewaresAfterEnd = middlewares.slice(repeatEndIndex + 1);
      log(`Ending modifier "${this.type}": ${newMiddlewares.length - middlewares.length} middlewares were added`);
      return newMiddlewares.concat(middlewaresAfterEnd);
    },
  });
  return modifier;
};

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
