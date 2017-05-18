'use strict';


const { mapAsync } = require('./functional');


// Returns a middleware that works as a switch statement towards
// other middlewares
//   @param middlewares {object} - values are middleware functions,
//                                 i.e. async function that returns another
//                                 async function, that takes request input
//                                 as argument
//   @param getKey {function}    - takes server options and request input as
//                                 argument, returns key for middlewares[key]
const getSwitchMiddleware = function ({ middlewares, getKey }) {
  return async function switchMiddleware(opts) {
    const mdws = await mapAsync(middlewares, async mdw => await mdw(opts));

    return async function switchMiddleware(input) {
      const key = getKey({ opts, input });
      return mdws[key].call(this, input);
    };
  };
};


module.exports = {
  getSwitchMiddleware,
};
