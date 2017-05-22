'use strict';


const { map } = require('../../utilities');


/**
 * Bind JSL arguments of custom IDL such as helpers and variables
 **/
const wrapCustomJsl = function ({ idl: { helpers, variables } }) {
  return async function wrapCustomJsl(input) {
    const { jsl } = input;

    // Add request-specific information to helpers and variables
    const boundHelpers = map(helpers, helper => helper({ jsl }));
    const boundVariables = map(variables, variable => variable({ jsl }));
    jsl.add({ helpers: boundHelpers, variables: boundVariables });

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  wrapCustomJsl,
};
