'use strict';


const { memoize } = require('../utilities');


// Like memoize(), except if first argument `type` indicates the
// JSL is supplied by client, i.e. is subject to constant change,
// do not memoize
const memoizeUnlessClient = function (func) {
  const memoizedFunc = memoize(func);
  return (obj, ...args) => {
    const { type } = obj;
    return clientTypes.includes(type)
      ? func(obj, ...args)
      : memoizedFunc(obj, ...args);
  };
};

const clientTypes = ['filter', 'data'];


module.exports = {
  memoizeUnlessClient,
};
