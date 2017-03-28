'use strict';


const getPromise = function () {
  let resolve, reject;
  const promise = new Promise((resolveFunc, rejectFunc) => {
    resolve = resolveFunc;
    reject = rejectFunc;
  });
  Object.assign(promise, { resolve, reject });
  return promise;
};


module.exports = {
  getPromise,
};