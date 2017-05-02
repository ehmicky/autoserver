'use strict';


const { memoize, map } = require('../../utilities');
const { getJslVariables } = require('../../jsl');


/**
 * Bind JSL arguments of custom IDL such as helpers and variables
 **/
const wrapCustomJsl = async function ({ idl }) {
  return async function (input) {
    const { info, params } = input;

    for (const { name, getList, getVars } of customJsl) {
      // We must create a reference first, so that `getVars` gets a reference, although empty for the moment
      info[name] = {};

      // Retrieve IDL helpers|variables
      const list = getList({ idl });

      // Transform JSL into wrapped functions
      const jslInput = getVars({ info, params });
      const wrappedJsl = map(list, jsl => wrapJsl({ jsl, jslInput }));

      Object.assign(info[name], wrappedJsl);
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
const wrapJsl = function ({ jsl, jslInput }) {
  // Helpers|variables can be non-JSL, but still needs to be fired as function by consumers
  if (typeof jsl !== 'function') {
    return () => jsl;
  }

  // We memoize for performance reasons, i.e. helpers|variables should be pure functions
  // The memiozer is recreated at each request though, to avoid memory leaks
  return memoize(($1, $2, $3, $4, $5, $6, $7, $8, $9) => {
    // Make sure variables are fired runtime, so variables can be evaluated lazily
    const variables = getJslVariables(Object.assign({}, jslInput, { jsl }));
    return jsl(Object.assign({}, variables, { $1, $2, $3, $4, $5, $6, $7, $8, $9 }));
  });
};



module.exports = {
  wrapCustomJsl,
};
