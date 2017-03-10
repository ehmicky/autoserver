'use strict';


/**
 * Transforms a Connect/Express middleware into a Promise
 *
 * @param middleware {function} Connect middleware. Take (req, res, next) as argument, fires next(error, val)
 * @returns promise {Promise}
 */
const connectToPromise = function(middleware) {
  return (req, res) => {
    return new Promise((resolve, reject) => {
      middleware(req, res, (error, val) => {
        if (error) { reject(error) } else { resolve(val) }
      });
    });
  };
};


module.exports = connectToPromise;