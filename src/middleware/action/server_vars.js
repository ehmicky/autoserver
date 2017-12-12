'use strict';

const { getServerVars } = require('../../functions');

// Bind server-specific variables with their config variables
// This middleware needs to be:
//  - late enough to pass as many config variables as possible to
//    server-specific variables
//  - early enough to be before any config function is fired
//  - only passing config variables that are not changed through the
//    request.
//    For example `collection` should not be available to server-specific
//    variables.
const bindServerVars = function ({ config, mInput }) {
  const serverVars = getServerVars({ config, mInput });
  return { serverVars };
};

module.exports = {
  bindServerVars,
};
