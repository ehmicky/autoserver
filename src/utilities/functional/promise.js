'use strict';

// Similar to `await retVal` and `Promise.resolve(retVal).then()`
// As opposed to them, this does not create a new promise callback if the
// return value is synchronous, i.e. it avoids unnecessary new microtasks
const promiseThen = function (retVal, func) {
  // eslint-disable-next-line promise/prefer-await-to-then
  if (!retVal || typeof retVal.then !== 'function') {
    return func(retVal);
  }

  // eslint-disable-next-line promise/prefer-await-to-then
  return retVal.then(func);
};

module.exports = {
  promiseThen,
};
