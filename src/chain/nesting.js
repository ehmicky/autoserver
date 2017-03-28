'use strict';


const middlewaresSymbol = Symbol('middlewares');


// Normalize middleware, so consumers can:
//   - can pass a single function, or an array
//   - nest chain()
// Should be used by modifiers on input, if they take middleware as arguments
const flatten = function (middlewares) {
  middlewares = middlewares instanceof Array ? middlewares : [middlewares];
  middlewares = middlewares.reduce(function (flatten, middleware) {
    const nestedMiddleware = middleware[middlewaresSymbol];
    // Do not keep the placeholder last middleware
    const newMiddleware = nestedMiddleware ? nestedMiddleware.slice(0, nestedMiddleware.length - 1) : middleware;
    return flatten.concat(newMiddleware);
  }, []);
  return middlewares;
};


module.exports = {
  middlewaresSymbol,
  flatten,
};