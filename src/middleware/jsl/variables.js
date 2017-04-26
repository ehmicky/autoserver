'use strict';


// Values available as `$variable` in JSL
// They are uppercase to avoid name conflict with attributes
const getJslVariables = function ({ info: { ip, timestamp, actionType }, params, model, data }) {
  // Context-related variables in JSL
  const NOW = timestamp;

  // Request-related variables in JSL
  const IP = ip;
  const PARAMS = params;

  // Model-related variables in JSL
  const ACTION = actionType;
  const MODEL = model;
  const DATA = data;

  // TODO: hack until we introduce custom variables
  const User = { id: '1' };

  return { NOW, IP, PARAMS, MODEL, DATA, ACTION, User };
};


module.exports = {
  getJslVariables,
};
