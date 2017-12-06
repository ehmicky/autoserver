'use strict';

const { mapValues } = require('../../utilities');

const { getVars } = require('./values');

// Retrieve all server-specific variables.
// Functions are bound with schema variables.
const getServerVars = function ({ schema: { variables }, mInput }) {
  const vars = getVars(mInput);

  // Only pass schema variables to schema.variables.* not schema.variables.*.*
  const serverVars = mapValues(
    variables,
    serverVar => bindServerVar({ serverVar, vars }),
  );

  // Allow server-specific variables to call each other
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(vars, serverVars);

  return serverVars;
};

// Add schema variable to every server-specific variable that is a function,
// as a first bound parameter
const bindServerVar = function ({ serverVar, vars }) {
  // Constants are left as is, including object containing functions
  if (typeof serverVar !== 'function') { return serverVar; }

  // Same as `serverVar.bind(null, vars)`, except works when `serverVar` is both
  // a function and an object with a `bind` member, e.g. Lodash main object.
  const serverVarA = Function.prototype.bind.call(serverVar, null, vars);

  // Keep static member
  // E.g. Underscore/Lodash main exported object is both a function and an
  // object with function members
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(serverVarA, serverVar);

  return serverVarA;
};

module.exports = {
  getServerVars,
};
