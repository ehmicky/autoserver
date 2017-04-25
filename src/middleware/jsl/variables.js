'use strict';


// Values available as `$variable` in JSL
// They are uppercase to avoid name conflict with attributes
const getJslVariables = function ({ info: { ip }, params, model }) {
  // Context-related variables in JSL
  const NOW = (new Date()).toISOString();

  // Request-related variables in JSL
  const IP = ip;
  const PARAMS = params;

  // Model-related variables in JSL
  const MODEL = model;

  return { NOW, IP, PARAMS, MODEL };
};


module.exports = {
  getJslVariables,
};
