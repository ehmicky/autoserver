'use strict';

// Retrieve system variables, user variables and call-specific variables
const getVars = function (
  {
    protocol,
    timestamp,
    ip,
    requestid,
    rpc,
    collname: collection,
    top: { command: { type: command } = {} } = {},
    topargs: args,
    topargs: { params: params = {} } = {},
  },
  {
    userVars,
    vars,
  } = {},
) {
  // Order matters:
  //  - we want to be 100% sure userVars do not overwrite system variables
  //  - it is possible to overwrite system vars with call-specific `vars`
  return {
    ...userVars,
    protocol,
    timestamp,
    ip,
    requestid,
    rpc,
    collection,
    args,
    command,
    params,
    ...vars,
  };
};

// Retrieve model-related system variables
const getModelVars = function ({ model, previousmodel, attrName }) {
  const value = model[attrName];
  const previousvalue = previousmodel == null
    ? undefined
    : previousmodel[attrName];

  return { model, value, previousmodel, previousvalue };
};

module.exports = {
  getVars,
  getModelVars,
};
