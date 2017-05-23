'use strict';


const { log } = require('../../utilities');


// Report error for monitoring
const reportError = function ({ errorObj, opts: { onRequestError } }) {
  // Generic logger, by default console.error()
  log.error(errorObj);
  // Custom monitoring
  if (onRequestError) {
    onRequestError(errorObj);
  }
};


module.exports = {
  reportError,
};
