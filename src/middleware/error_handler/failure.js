'use strict';


const { reportError } = require('./report');


// If error handler fails, only reports failure then gives up
const handleFailure = function ({ error, innererror, opts }) {
  const response = getErrorHandlerFailure({ error, innererror });
  reportError({ response, opts });
};

const getErrorHandlerFailure = function ({
  error: { instance },
  innererror: { stack: details },
}) {
  return {
    type: 'ERROR_HANDLER_FAILURE',
    title: 'Error handler failed',
    description: 'Error handler failed',
    instance,
    details,
  };
};


module.exports = {
  handleFailure,
};
