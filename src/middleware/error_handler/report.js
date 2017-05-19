'use strict';


const { log } = require('../../utilities');


// Report error for monitoring
const reportError = function ({ response, opts: { onRequestError } }) {
  // Generic logger, by default console.error()
  log.error(response);
  // Custom monitoring
  if (onRequestError) {
    onRequestError(response);
  }
};


module.exports = {
  reportError,
};
