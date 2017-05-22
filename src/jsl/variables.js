'use strict';


const { omit } = require('lodash');


// Values available as `$VARIABLE` in JSL
// They are uppercase to avoid name conflict with attributes
const getJslVariables = function (jslFunc, input) {
  const { helpers, variables } = input;

  const vars = {};

  // From idl.helpers
  if (helpers) {
    Object.assign(vars, helpers);
  }

  // From idl.variables
  if (variables) {
    // Only pass the variables that are actually needed
    const usedVariables = getUsedVariables({ func: jslFunc, variables });
    const variablesParams = usedVariables
      .map(usedVariable => {
        const variable = variables[usedVariable];
        // Instantiate variables lazily, i.e. when some JSL using them
        // gets processed
        const evaluatedVar = typeof variable === 'function'
          ? variable()
          : variable;
        return { [usedVariable]: evaluatedVar };
      })
      .reduce((params, variable) => Object.assign(params, variable), {});
    Object.assign(vars, variablesParams);
  }

  Object.assign(vars, omit(input, ['helpers', 'variables']));

  return vars;
};

// Find whether variables are used by a function
// At the moment, do a simplistic string search on Function.toString()
// TODO: use proper JavaScript parser instead of imperfect RegExp matching
const getUsedVariables = function ({ func, variables }) {
  const funcBody = func.toString().replace(/^[^)]+\)/, '');
  const usedVariables = Object.keys(variables)
    .filter(variable => funcBody.indexOf(variable) !== -1);
  return usedVariables;
};


module.exports = {
  getJslVariables,
};
