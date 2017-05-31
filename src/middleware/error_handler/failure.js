'use strict';


const { reportError } = require('./report');


// If error handler fails, only reports failure then gives up
const handleFailure = function ({ error }) {
  const details = error.stack || error;
  const errorObj = {
    type: 'ERROR_HANDLER_FAILURE',
    title: 'Error handler failed',
    description: 'Error handler failed',
    details,
  };

  reportError({ error: errorObj });
};


module.exports = {
  handleFailure,
};
