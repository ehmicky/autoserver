'use strict';


const { getStandardError } = require('../../error');
const { getResponse } = require('./response');
const { reportError } = require('./report');


const handleError = function ({ log, error }) {
  const standardError = getStandardError({ log, error });

  const errorResponse = getResponse({ error: standardError });

  reportError({ log, error: standardError });

  // Use protocol-specific way to send back the response to the client
  if (error.sendError) {
    error.sendError(errorResponse);
  }
};


module.exports = {
  handleError,
};
