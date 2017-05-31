'use strict';


const { log } = require('../../utilities');


// Report error for monitoring
const reportError = function ({ error }) {
  // Generic logger, by default console.error()
  log.error(error);
};


module.exports = {
  reportError,
};
