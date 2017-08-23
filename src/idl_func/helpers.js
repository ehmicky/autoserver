'use strict';

const { mapValues } = require('../utilities');

// Take IDL function, inline or not, and turns into `function (...args)`
// firing the first one, with $1, $2, etc. provided as extra arguments
const getHelpers = function ({ helpers, paramsRef }) {
  return mapValues(helpers, ({ value: helper, useParams }) =>
    getHelper({ helper, useParams, paramsRef })
  );
};

const getHelper = function ({
  helper,
  helper: { inlineFunc },
  useParams,
  paramsRef,
}) {
  // Constants are left as is
  const isConstant = typeof helper !== 'function';
  if (isConstant) { return helper; }

  // Non-inline helpers with `useParams` false only get
  // positional arguments, no parameters
  if (!inlineFunc && !useParams) { return helper; }

  const helperA = runHelper.bind(null, { helper, paramsRef });

  // Keep static member
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(helperA, { inlineFunc });

  return helperA;
};

// Inline function, or non-inline with `useParams` true
// When consumer fires Helper('a', 'b'), inline function translates 'a' and 'b'
// into $1 and $2 parameters, and runIdlFunc() is performed.
const runHelper = function ({ helper, paramsRef }, ...args) {
  const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
  const posParams = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };

  return helper({ ...paramsRef.params, ...posParams }, ...args);
};

// Pass IDL function parameters to helpers
// I.e. helpers have same parameters as their caller
// We use a `paramsRef` object reference so that all helpers share the same
// information, and can call each other.
// We directly mutate it as a performance optimization.
const bindHelpers = function ({ paramsRef, params }) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  paramsRef.params = params;
};

module.exports = {
  getHelpers,
  bindHelpers,
};
