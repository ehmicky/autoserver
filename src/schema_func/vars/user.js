'use strict';

const { mapValues } = require('../../utilities');

// Take schema function, inline or not, and turns into `function (...args)`
// firing the first one, with arg1, arg2, etc. provided as extra arguments
const getUserVars = function ({ schema: { variables } }) {
  const varsRef = {};
  const userVars = mapValues(
    variables,
    userVar => getUserVar({ varsRef, userVar }),
  );

  return { varsRef, userVars };
};

const getUserVar = function ({ varsRef, userVar }) {
  // Constants are left as is, including object containing functions
  if (typeof userVar !== 'function') { return userVar; }

  const userVarA = runUserVar.bind(null, { userVar, varsRef });

  // Keep static member
  // E.g. Underscore/Lodash main exported object is both a function and an
  // object with function members
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(userVarA, userVar);

  return userVarA;
};

// When consumer fires userVar('a', 'b'), inline function translates 'a' and 'b'
// into arg1 and arg2 variables, and runSchemaFunc() is performed.
// We do not use `...args` as a performance optimization
// eslint-disable-next-line max-params
const runUserVar = function (
  { userVar, varsRef: { ref } },
  arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9,
) {
  // Even without arg1, etc. we would need to make a shallow copy of `ref`,
  // or make it immutable, to avoid `userVar()` from creating side-effects
  // influencing another user variable
  const vars = { ...ref, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 };

  return userVar(vars, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};

// Pass other variables to user variables
// I.e. user variables have same variables as their caller
// We use a `varsRef` object reference so that all user variables share the same
// information, and can call each other.
// We directly mutate it as a performance optimization.
const bindVariables = function ({ varsRef, vars }) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  varsRef.ref = vars;
};

module.exports = {
  getUserVars,
  bindVariables,
};
