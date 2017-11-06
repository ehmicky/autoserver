'use strict';

const { protocolHandlers } = require('../../protocols');
const { operationHandlers } = require('../../operations');
const { COMMAND_TYPES } = require('../../constants');

// Retrieve system variables, user variables and call-specific variables
const getVars = function (
  {
    protocol: $protocol,
    timestamp: $timestamp,
    ip: $ip,
    requestid: $requestid,
    operation: $operation,
    modelname: $modelname,
    top: { command: { type: $command } = {} } = {},
    topArgs: $args,
    topArgs: { params: $params = {} } = {},
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
    $protocol,
    $timestamp,
    $ip,
    $requestid,
    $operation,
    $modelname,
    $args,
    $command,
    $params,
    ...vars,
  };
};

// Retrieve model-related system variables
const getModelVars = function ({ model, previousmodel, attrName }) {
  const val = model[attrName];
  const previousval = previousmodel == null
    ? undefined
    : previousmodel[attrName];

  return {
    $model: model,
    $val: val,
    $previousmodel: previousmodel,
    $previousval: previousval,
  };
};

const protocols = Object.keys(protocolHandlers);
const operations = Object.keys(operationHandlers);

// System variables that are always present
// We need to specify their `type` and `isArray` for `model.authorize`
// validation
const SYSTEM_VARS = {
  $protocol: { type: 'string', validation: { enum: protocols } },
  $timestamp: { type: 'string' },
  $ip: { type: 'string' },
  $requestid: { type: 'string' },
  $operation: { type: 'string', validation: { enum: operations } },
  $modelname: { type: 'string' },
  $command: {
    type: 'string',
    validation: {
      enum: COMMAND_TYPES,
      // With patch authorization, one can simulate find and replace
      // authorization and vice-versa. So to avoid mistakes, we force
      // specifying them together.
      requires: [
        [['patch'], ['find']],
        [['upsert'], ['find']],
        [['create'], ['find']],
        [['delete'], ['find']],
        [['upsert'], ['create', 'patch']],
        [['create', 'patch'], ['upsert']],
      ],
    },
  },
  $args: { type: 'dynamic' },
  $params: { type: 'dynamic' },
};

module.exports = {
  getVars,
  getModelVars,
  SYSTEM_VARS,
};
