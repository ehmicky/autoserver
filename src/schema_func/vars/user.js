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
    userVar => getUserVar({ vars, userVar }),
  );

  // Allow user variables to call each other
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(vars, userVars);

  return userVars;
};

const getUserVar = function ({ vars, userVar }) {
  // Constants are left as is, including object containing functions
  if (typeof userVar !== 'function') { return userVar; }

  const userVarA = runUserVar.bind(null, { userVar, vars });

  // Keep static member
  // E.g. Underscore/Lodash main exported object is both a function and an
  // object with function members
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(userVarA, userVar);

  return userVarA;
};

// When consumer fires userVar('a', 'b'), inline function translates 'a' and 'b'
// into arg1 and arg2 variables, and runSchemaFunc() is performed.
// arg1, etc. are passed both as named arguments and positional arguments.
// We do not use `...args` as a performance optimization
// eslint-disable-next-line max-params
const runUserVar = function (
  { userVar, vars },
  arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9,
) {
  // Even without arg1, etc. we would need to make a shallow copy of `vars`,
  // or make it immutable, to avoid `userVar()` from creating side-effects
  // influencing another user variable
  const all = { ...vars, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 };

  return userVar(all, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};

module.exports = {
  getUserVars,
};
