'use strict';


const { mapValues } = require('lodash');

const { memoize } = require('../../utilities');


/**
 * Bind JSL arguments of custom IDL such as helpers and variables
 **/
const compileCustomJsl = async function ({ idl: { helpers } }) {
  return async function (input) {
    const { info, params } = input;

    const vars = { request: { info, params } };
    info.helpers = compileHelpers({ helpers, vars });
    // Allow helpers to use each other
    Object.assign(vars, info.helpers);

    const response = await this.next(input);
    return response;
  };
};

// Take compiled JSL `function ({ $var, ... })` and turns into `function (...args)` firing the first one,
// with $1, $2, etc. provided as extra arguments
const compileHelpers = function ({ helpers, vars }) {
  return mapValues(helpers, helper => {
    // We memoize for performance reasons, i.e. helpers should be pure functions
    // The memiozer is recreated at each request though, to avoid memory leaks
    return memoize(($1, $2, $3, $4, $5, $6, $7, $8, $9) => {
      return helper(Object.assign({}, vars, { $1, $2, $3, $4, $5, $6, $7, $8, $9 }));
    });
  });
};



module.exports = {
  compileCustomJsl,
};
