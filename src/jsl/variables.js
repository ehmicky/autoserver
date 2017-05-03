'use strict';


// Values available as `$VARIABLE` in JSL
// They are uppercase to avoid name conflict with attributes
const getJslVariables = function (input = {}) {
  const { jsl: jslFunc, helpers, variables, requestInput, modelInput } = input;
  const { ip, timestamp, params } = requestInput || {};
  const { actionType, attrName, model, data, shortcut = {} } = modelInput || {};

  let vars = {};

  if (helpers) {
    Object.assign(vars, helpers);
  }

  if (variables) {
    // Only pass the variables that are actually needed
    const usedVariables = getUsedVariables({ func: jslFunc, variables });
    const variablesParams = usedVariables
      .map(usedVariable => {
        const variable = variables[usedVariable];
        // Instantiate variables lazily, i.e. when some JSL using them gets processed
        const evaluatedVar = typeof variable === 'function' ? variable() : variable;
        return { [usedVariable]: evaluatedVar };
      })
      .reduce((params, variable) => Object.assign(params, variable), {});
    Object.assign(vars, variablesParams);
  }

  // Request-related variables
  if (requestInput) {
    Object.assign(vars, {
      $NOW: timestamp,
      $IP: ip,
      $PARAMS: params,
    });
  }

  // Model-related variables
  if (modelInput) {
    Object.assign(vars, {
      $ACTION: actionType,
      $ATTR_NAME: attrName,
      $: shortcut[attrName],
      $$: shortcut,


      // TODO: hack until we introduce custom variables
      User: { id: '1' },
    });
    if (model) {
      vars.$MODEL = model;
    }
    if (data) {
      vars.$DATA = data;
    }
  }

  return vars;
};

// Find whether variables are used by a function
// At the moment, do a simplistic string search on Function.toString()
// TODO: use proper JavaScript parser instead of imperfect RegExp matching
const getUsedVariables = function ({ func, variables }) {
  const funcBody = func.toString().replace(/^[^)]+\)/, '');
  const usedVariables = Object.keys(variables).filter(variable => funcBody.indexOf(variable) !== -1);
  return usedVariables;
};



module.exports = {
  getJslVariables,
};
