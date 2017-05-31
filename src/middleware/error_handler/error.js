'use strict';


const { getStandardError } = require('./standard');
const { getResponse } = require('./response');
const { reportError } = require('./report');


const handleError = function ({ logInfo, error, info }) {
  const standardError = getStandardError({ error, info });

  const errorResponse = getResponse({ error: standardError });

  reportError({ logInfo, error: standardError });

  // Use protocol-specific way to send back the response to the client
  if (error.sendError) {
    error.sendError(errorResponse);
  }
};


module.exports = {
  handleError,
};
