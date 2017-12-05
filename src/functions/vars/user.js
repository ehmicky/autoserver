'use strict';

const { mapValues } = require('../../utilities');

const { getVars } = require('./values');

// Take schema function, inline or not, and turns into `function (...args)`
// firing the first one, with arg1, arg2, etc. provided as extra arguments
const getUserVars = function ({ schema: { variables }, mInput }) {
  const vars = getVars(mInput);

  // Only pass schema variables to schema.variables.* not schema.variables.*.*
  const userVars = mapValues(
    variables,
    userVar => bindUserVar({ userVar, vars }),
  );

  // Allow user variables to call each other
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(vars, userVars);

  return userVars;
};

// Add schema variable to every user variable that is a function, as a first
// bound parameter
const bindUserVar = function ({ userVar, vars }) {
  // Constants are left as is, including object containing functions
  if (typeof userVar !== 'function') { return userVar; }

  // Same as `userVar.bind(null, vars)`, except works when `userVar` is both
  // a function and an object with a `bind` member, e.g. Lodash main object.
  const userVarA = Function.prototype.bind.call(userVar, null, vars);

  // Keep static member
  // E.g. Underscore/Lodash main exported object is both a function and an
  // object with function members
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(userVarA, userVar);

  return userVarA;
};

module.exports = {
  getUserVars,
};
