'use strict';


const { defaults } = require('lodash');


// Values available as `$variable` in JSL
// They are uppercase to avoid name conflict with attributes
const getJslVariables = function (input = {}) {
  defaults(input, { model: {}, data: {} });
  const { info: { ip, timestamp, actionType } = {}, name, params, model, data, shortcut = 'model' } = input;

  const shortcutObj = input[shortcut];

  const vars = {
    // Context-related variables in JSL
    $now: timestamp,

    // Request-related variables in JSL
    $ip: ip,
    $params: params,

    // Model-related variables in JSL
    $action: actionType,
    $model: model,
    $: shortcutObj[name],
    $$: shortcutObj,
    $data: data,

    // TODO: hack until we introduce custom variables
    User: { id: '1' },
  };

  return vars;
};

// Returns { $name, $now, ... } which will become JSL functions parameter list
const jslArguments = `{ ${Object.keys(getJslVariables())} }`;


module.exports = {
  getJslVariables,
  jslArguments,
};
