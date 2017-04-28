'use strict';


const { mapValues, each } = require('lodash');

const { memoize } = require('../../utilities');
const { getJslVariables, evaluateRecursiveVars } = require('../../jsl');


/**
 * Bind JSL arguments of custom IDL such as helpers and variables
 **/
const wrapCustomJsl = async function ({ idl }) {
  return async function (input) {
    const { info, params } = input;

    for (const { name, getList, getVars } of customJsl) {
      const list = getList({ idl });

      // Binds `vars` to each custm IDL
      const vars = {};
      info[name] = mapValues(list, (jslFunc, jslName) => {
        vars[jslName] = {};
        return wrapJsl({ jslFunc, vars: vars[jslName] });
      });

      // Populate variables to `vars` bound to custom IDL
      const jslInput = getVars({ info, params });
      each(list, (jslFunc, jslName) => {
        const singleJslInput = Object.assign({}, jslInput, { jsl: jslFunc });
        // Allows helpers|variables to reference each other
        Object.assign(vars[jslName], getJslVariables(singleJslInput));
      });
    }

    const response = await this.next(input);
    return response;
  };
};

const customJsl = [
  {
    name: 'helpers',
    getList: ({ idl: { helpers } }) => helpers,
    getVars: ({ info: { ip, timestamp, helpers }, params }) => ({ requestInput: { ip, timestamp, params }, helpers }),
  },
  {
    name: 'variables',
    getList: ({ idl: { variables } }) => variables,
    getVars: ({ info: { ip, timestamp, helpers, variables }, params }) => ({ requestInput: { ip, timestamp, params }, helpers, variables }),
  },
];

// Take compiled JSL `function ({ $var, ... })` and turns into `function (...args)` firing the first one,
// with $1, $2, etc. provided as extra arguments
const wrapJsl = function ({ jslFunc, vars }) {
  // Helpers|variables can be non-JSL, but still needs to be fired as function by consumers
  if (typeof jslFunc !== 'function') {
    return () => jslFunc;
  }

  // We memoize for performance reasons, i.e. helpers|variables should be pure functions
  // The memiozer is recreated at each request though, to avoid memory leaks
  return memoize(($1, $2, $3, $4, $5, $6, $7, $8, $9) => {
    const evaluatedVars = evaluateRecursiveVars({ variables: vars });

    return jslFunc(Object.assign({}, evaluatedVars, { $1, $2, $3, $4, $5, $6, $7, $8, $9 }));
  });
};



module.exports = {
  wrapCustomJsl,
};
