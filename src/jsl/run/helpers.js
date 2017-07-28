'use strict';

const { mapValues } = require('../../utilities');
const { isJsl } = require('../test');

const { runJsl } = require('./run');

// Take JSL, inline or not, and turns into `function (...args)`
// firing the first one, with $1, $2, etc. provided as extra arguments
const getHelpers = function ({ idl: { helpers = {} } }) {
  return mapValues(helpers, ({ value: helper, useParams }) => {
    // Constants are left as is
    const isConstant = typeof helper !== 'function' && !isJsl({ jsl: helper });
    if (isConstant) { return helper; }

    return jslHelper.bind(null, { helper, useParams });
  });
};

// Inline JSL helper function.
// When consumer fires Helper('a', 'b'), inline JSL translates 'a' and 'b'
// into $1 and $2 parameters, and runJsl() is performed.
const jslHelper = function (
  { helper, useParams },
  { params, type, idl },
  ...args
) {
  // Provide $1, $2, etc. to inline JSL
  const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
  const posParams = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };
  const paramsA = { ...params, ...posParams };

  // JSL is run
  if (typeof helper !== 'function') {
    return runJsl({ value: helper, jsl: { params: paramsA }, type, idl });
  }

  // Non-inline helpers only get positional arguments, no parameters
  if (useParams) {
    return helper(paramsA, ...args);
  }

  return helper(...args);
};

module.exports = {
  getHelpers,
};
