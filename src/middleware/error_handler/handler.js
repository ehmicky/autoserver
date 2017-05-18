'use strict';


const { sendError } = require('./send');


// Error handler, which sends final response, if errors
const errorHandler = function (opts) {
  const sendErrorFunc = sendError(opts);

  return async function errorHandler(input) {
    try {
      const response = await this.next(input);
      return response;
    } catch (exception) {
      sendErrorFunc({ exception, input });
    }
  };
};


module.exports = {
  errorHandler,
};
