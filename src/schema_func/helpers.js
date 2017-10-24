'use strict';

const { mapValues } = require('../utilities');

// Take schema function, inline or not, and turns into `function (...args)`
// firing the first one, with $1, $2, etc. provided as extra arguments
const getHelpers = function ({ schema: { helpers } }) {
  const varsRef = {};
  const helpersA = mapValues(helpers, helper => getHelper({ varsRef, helper }));

  return { varsRef, helpers: helpersA };
};

const getHelper = function ({ varsRef, helper }) {
  // Constants are left as is, including object containing functions
  if (typeof helper !== 'function') { return helper; }

  const helperA = runHelper.bind(null, { helper, varsRef });

  // Keep static member
  // E.g. Underscore/Lodash main exported object is both a function and an
  // object with function members
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(helperA, helper);

  return helperA;
};

// When consumer fires Helper('a', 'b'), inline function translates 'a' and 'b'
// into $1 and $2 variables, and runSchemaFunc() is performed.
// We do not use `...args` as a performance optimization
// eslint-disable-next-line max-params
const runHelper = function (
  { helper, varsRef: { ref } },
  $1, $2, $3, $4, $5, $6, $7, $8, $9,
) {
  const vars = { ...ref, $1, $2, $3, $4, $5, $6, $7, $8, $9 };

  return helper(vars, $1, $2, $3, $4, $5, $6, $7, $8, $9);
};

// Pass schema function variables to helpers
// I.e. helpers have same variables as their caller
// We use a `varsRef` object reference so that all helpers share the same
// information, and can call each other.
// We directly mutate it as a performance optimization.
const bindVariables = function ({ varsRef, vars }) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  varsRef.ref = vars;
};

module.exports = {
  getHelpers,
  bindVariables,
};
