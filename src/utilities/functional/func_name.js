'use strict';

// Wraps a functor so it does not modify a function name
// Function names are e.g. used by performance monitoring
const keepFuncName = function (functor) {
  return (func, ...args) => {
    const funcA = functor(func, ...args);
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(funcA, 'name', { value: func.name });
    return funcA;
  };
};

module.exports = {
  keepFuncName,
};
