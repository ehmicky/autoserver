'use strict';


const { map } = require('../../utilities');


/**
 * Bind JSL arguments of custom IDL such as helpers and variables
 **/
const wrapCustomJsl = async function ({ idl: { helpers, variables } }) {
  return async function wrapCustomJsl(input) {
    const { info, params } = input;
    const { ip, timestamp } = info;
    const requestInput = { ip, timestamp, params };

    // Add request-specific information to helpers and variables
    info.helpers = map(helpers, helper => helper({ info, requestInput }));
    info.variables = map(variables, variable => variable({ info, requestInput }));

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  wrapCustomJsl,
};
