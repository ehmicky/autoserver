'use strict';


const { getPromise } = require('./promise');


/**
 * Transforms a Connect/Express middleware into a Promise
 *
 * @param {function} middleware - Connect middleware. Take (req, res, next) as argument, fires next(error, val)
 * @returns {Promise} promise
 */
const connectToPromise = function (middleware) {
  return async (req, res) => {
    const promise = getPromise();
    middleware(req, res, (error, val) => {
      if (error) { throw error; }
      promise.resolve(val);
    });
    return await promise;
  };
};


module.exports = {
  connectToPromise,
};