'use strict';

/**
 * Transforms a series of functions into a middleware stack.
 * More precisely:
 *   - take an array of functions as input, and returns it transformed
 *   - calling `this.next(...)` in any function will now call the next function
 *     with the same arguments
 *   - the last function's `this.next(...)` throws an error
 * Characteristics:
 *   - as opposed to Express middleware, but similarly to Koa,
 *     the middleware series is conceptually a stack, not a pipe.
 *   - as opposed to Koa, the `next` function can:
 *      - be done several times per middleware
 *      - take any arguments, and return any value, including promise,
 *        i.e. can use async functions
 * Note:
 *   - since this binds functions contexts, `this` can only be used to call
 *     `this.next(...)` and functions contexts should not re-bound.
 *
 * @param {function[]} middlewares
 * @returns {function[]} middlewares
 */
const chain = function (funcs) {
  return funcs
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
  return [...funcs, func.bind({ next })];
};

module.exports = {
  chain,
};
