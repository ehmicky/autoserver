'use strict';

// Returns the main numerical limits of the engine.
// Some of those limits cannot be changed by the user.
const getLimits = function ({
  runOpts: {
    maxPageSize,
  },
}) {
  return {
    // Max number of top-level models returned in a response
    maxPageSize,

    // Max level of nesting in query string, e.g. ?var.subvar.subvar2=val
    maxQueryStringDepth: 10,
    // Max length of arrays in query string, e.g. ?var[50]=val
    maxQueryStringLength: 100,
  };
};

module.exports = {
  getLimits,
};
