'use strict';


const { log } = require('../../utilities');


// Report error for monitoring
const reportError = function ({ error, opts: { onRequestError } }) {
  // Generic logger, by default console.error()
  log.error(error);
  // Custom monitoring
  if (onRequestError) {
    onRequestError(error);
  }
};


module.exports = {
  reportError,
};
