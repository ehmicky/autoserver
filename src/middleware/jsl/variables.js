'use strict';


// Values available as `$variable` in JSL
// They are uppercase to avoid name conflict with attributes
const getJslVariables = function ({ info: { ip, actionType }, params, model, data }) {
  // Context-related variables in JSL
  const NOW = (new Date()).toISOString();

  // Request-related variables in JSL
  const IP = ip;
  const PARAMS = params;

  // Model-related variables in JSL
  const ACTION = actionType;
  const MODEL = model;
  const DATA = data;

  return { NOW, IP, PARAMS, MODEL, DATA, ACTION };
};


module.exports = {
  getJslVariables,
};
