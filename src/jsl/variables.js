'use strict';


// Values available as `$VARIABLE` in JSL
// They are uppercase to avoid name conflict with attributes
const getJslVariables = function (input = {}) {
  const { jsl: jslFunc, helpers, variables, validationInput, requestInput, interfaceInput, modelInput } = input;
  const { expected } = validationInput || {};
  const { ip, timestamp, params } = requestInput || {};
  const { actionType } = interfaceInput || {};
  const { parent = {}, value, model, data, attrName } = modelInput || {};

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

  // Database-request-related variables
  if (interfaceInput) {
    Object.assign(vars, {
      $ACTION: actionType,
    });
  }

  // Model-related variables
  if (modelInput) {
    Object.assign(vars, {
      $ATTR_NAME: attrName,
      $: value,
      $$: parent,

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

  // Custom validation keywords variables
  if (validationInput) {
    Object.assign(vars, {
      $EXPECTED: expected,
    });
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
