'use strict';


const { reportError } = require('./report');


// If error handler fails, only reports failure then gives up
const handleFailure = function ({ logInfo, error }) {
  const details = error.stack || error;
  const errorObj = {
    type: 'ERROR_HANDLER_FAILURE',
    title: 'Error handler failed',
    description: 'Error handler failed',
    details,
  };

  reportError({ logInfo, error: errorObj });
};


module.exports = {
  handleFailure,
};
