'use strict';


const { map } = require('../../utilities');


/**
 * Bind JSL arguments of custom IDL such as helpers and variables
 **/
const wrapCustomJsl = function ({ idl: { helpers, variables } }) {
  return async function wrapCustomJsl(input) {
    const { jslInput } = input;

    // Add request-specific information to helpers and variables
    jslInput.helpers = map(helpers, helper => helper({ jslInput }));
    jslInput.variables = map(variables, variable => variable({ jslInput }));

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  wrapCustomJsl,
};
