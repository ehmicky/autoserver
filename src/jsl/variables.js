'use strict';


// Values available as `$variable` in JSL
// They are uppercase to avoid name conflict with attributes
const getJslVariables = function (input = {}) {
  const { helpers, requestInput, modelInput } = input;
  const { ip, timestamp, params } = requestInput || {};
  const { actionType, attrName, model, data, shortcut = {} } = modelInput || {};

  let vars = {};

  if (helpers) {
    Object.assign(vars, helpers);
  }

  // Request-related variables
  if (requestInput) {
    Object.assign(vars, {
      $now: timestamp,
      $ip: ip,
      $params: params,
    });
  }

  // Model-related variables
  if (modelInput) {
    Object.assign(vars, {
      $action: actionType,
      $attrName: attrName,
      $: shortcut[attrName],
      $$: shortcut,


      // TODO: hack until we introduce custom variables
      User: { id: '1' },
    });
    if (model) {
      vars.$model = model;
    }
    if (data) {
      vars.$data = data;
    }
  }

  return vars;
};



module.exports = {
  getJslVariables,
};
