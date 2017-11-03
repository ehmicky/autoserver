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
    requestId: $requestId,
    operation: $operation,
    modelName: $modelName,
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
    $requestId,
    $operation,
    $modelName,
    $args,
    $command,
    $params,
    ...vars,
  };
};

// Retrieve model-related system variables
const getModelVars = function ({ model, oldModel, attrName }) {
  const val = model[attrName];
  const oldVal = oldModel == null ? undefined : oldModel[attrName];

  return { $model: model, $val: val, $oldModel: oldModel, $oldVal: oldVal };
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
  $requestId: { type: 'string' },
  $operation: { type: 'string', validation: { enum: operations } },
  $modelName: { type: 'string' },
  $command: {
    type: 'string',
    validation: {
      enum: COMMAND_TYPES,
      // With patch authorization, one can simulate find and replace
      // authorization and vice-versa. So to avoid mistakes, we force
      // specifying them together.
      equivalent: [['patch'], ['find', 'upsert']],
    },
  },
  $weights: { type: 'integer', isArray: true },
  $args: { type: 'dynamic' },
  $params: { type: 'dynamic' },
};

module.exports = {
  getVars,
  getModelVars,
  SYSTEM_VARS,
};
