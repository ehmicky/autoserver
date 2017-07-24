'use strict';

/**
 * Transforms a series of functions into a middleware stack.
 * More precisely:
 *   - take an array of functions as input, and returns it transformed
 *   - calling `nextFunc(...)` in any function will now call the next function
 *     with the same arguments, where `nextFunc` is passed as the first argument
 *   - the last function's `nextFunc(...)` throws an error
 * Characteristics:
 *   - as opposed to Express middleware, but similarly to Koa,
 *     the middleware series is conceptually a stack, not a pipe.
 *   - as opposed to Koa, the `next` function can:
 *      - be done several times per middleware
 *      - take any arguments, and return any value, including promise,
 *        i.e. can use async functions
 * Note:
 *   - since this binds functions arguments, `this` can not be used.
 *
 * @param {function[]} funcs
 * @param {object} [options]
 * @param {function[]} [options.before]: inserted before each middleware
 * @returns {function[]} middlewares
 */
const chain = function (funcs, { before: beforeOpt = [] } = {}) {
  return funcs
    // Insert recurring functions before each middleware
    .reduce((allFuncs, func) => {
      const beforeFuncs = beforeOpt.map(beforeFunc => beforeFunc(func));
      return [...allFuncs, ...beforeFuncs, func];
    }, [])
    // End of iteration
    .concat(lastFunc)
    // Bind each function context with { next(){} }
    // where `next` points to next function
    .reduceRight(bindFunctions, [])
    .reverse();
};

const lastFunc = function () {
  throw new Error('No middleware was able to handle the request');
};

const bindFunctions = function (funcs, func) {
  const next = funcs[funcs.length - 1];
  return [...funcs, func.bind(null, next)];
};

module.exports = {
  chain,
};
