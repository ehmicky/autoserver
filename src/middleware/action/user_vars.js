'use strict';

const { getUserVars } = require('../../functions');

// Bind user variables with their schema variables
// This middleware needs to be:
//  - late enough to pass as many schema variables as possible to user variables
//  - early enough to be before any schema function is fired
//  - only passing schema variables that are not changed through the request.
//    For example `collection` should not be available to user variables.
const bindUserVars = function ({ schema, mInput }) {
  const userVars = getUserVars({ schema, mInput });
  return { userVars };
};

module.exports = {
  bindUserVars,
};
