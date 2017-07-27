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

    return createJslHelper({ helper, useParams });
  });
};

// Inline JSL helper function.
// When consumer fires Helper('a', 'b'), inline JSL translates 'a' and 'b'
// into $1 and $2 parameters, and JSL.run() is performed.
const createJslHelper = function ({ helper, useParams }) {
  // The function name is used to distinguish it from other non-helper functions
  return function unboundJslHelper ({ params: oParams, type, idl }) {
    return function jslHelper (...args) {
      // Provide $1, $2, etc. to inline JSL
      const [$1, $2, $3, $4, $5, $6, $7, $8, $9] = args;
      const posParams = { $1, $2, $3, $4, $5, $6, $7, $8, $9 };
      const params = Object.assign({}, oParams, posParams);

      // JSL is run
      if (typeof helper !== 'function') {
        return runJsl({ value: helper, jsl: { params }, type, idl });
      }

      // Non-inline helpers only get positional arguments, no parameters
      if (useParams) {
        return helper(params, ...args);
      }

      return helper(...args);
    };
  };
};

module.exports = {
  getHelpers,
};
