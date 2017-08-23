'use strict';

const { mapValues } = require('../utilities');

// Take IDL function, inline or not, and turns into `function (...args)`
// firing the first one, with $1, $2, etc. provided as extra arguments
const getHelpers = function ({ idl: { helpers = {} } }) {
  const varsRef = {};

  const helpersA = mapValues(helpers, ({ value: helper, useParams }) =>
    getHelper({ helper, useParams, varsRef })
  );

  return { varsRef, helpers: helpersA };
};

const getHelper = function ({
  helper,
  helper: { inlineFunc },
  useParams,
  varsRef,
}) {
  // Constants are left as is
  const isConstant = typeof helper !== 'function';
  if (isConstant) { return helper; }

  // Non-inline helpers with `useParams` false only get
  // positional arguments, no parameters
  if (!inlineFunc && !useParams) { return helper; }

  const helperA = runHelper.bind(null, { helper, varsRef });

  // Keep static member
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(helperA, { inlineFunc });

  return helperA;
};

// Inline function, or non-inline with `useParams` true
// When consumer fires Helper('a', 'b'), inline function translates 'a' and 'b'
// into $1 and $2 parameters, and runIdlFunc() is performed.
const runHelper = function ({ helper, varsRef }, ...args) {
  const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
  const posParams = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };

  return helper({ ...varsRef.params, ...posParams }, ...args);
};

// Pass IDL function parameters to helpers
// I.e. helpers have same parameters as their caller
// We use a `varsRef` object reference so that all helpers share the same
// information, and can call each other.
// We directly mutate it as a performance optimization.
const bindHelpers = function ({ varsRef, vars }) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  varsRef.params = vars;
};

module.exports = {
  getHelpers,
  bindHelpers,
};
