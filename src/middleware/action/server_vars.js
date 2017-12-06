'use strict';

const { getServerVars } = require('../../functions');

// Bind server-specific variables with their schema variables
// This middleware needs to be:
//  - late enough to pass as many schema variables as possible to
//    server-specific variables
//  - early enough to be before any schema function is fired
//  - only passing schema variables that are not changed through the request.
//    For example `collection` should not be available to server-specific
//    variables.
const bindServerVars = function ({ schema, mInput }) {
  const serverVars = getServerVars({ schema, mInput });
  return { serverVars };
};

module.exports = {
  bindServerVars,
};
