'use strict';

// Retrieve system variables, user variables and call-specific variables
const getVars = function (
  {
    protocol: $protocol,
    timestamp: $timestamp,
    ip: $ip,
    requestId: $requestId,
    operation: $operation,
    modelName: $modelName,
    topArgs: $args,
    topArgs: { params: $params = {} },
    command: $command,
  },
  {
    userVars,
    vars,
  } = {},
) {
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

// Retrieve schema functions variables names
const getVarsKeys = function ({ schema: { variables = {} } }) {
  return [...ALL_SYSTEM_VARS, ...Object.keys(variables)];
};

// System variables that are always present
const SYSTEM_VARS = {
  $protocol: { type: 'string' },
  $timestamp: { type: 'string' },
  $ip: { type: 'string' },
  $requestId: { type: 'string' },
  $operation: { type: 'string' },
  $modelName: { type: 'string' },
  $command: { type: 'string' },
  $args: { type: 'dynamic' },
  $params: { type: 'dynamic' },
};

// Includes the system variables that are not always present
const ALL_SYSTEM_VARS = [
  ...Object.keys(SYSTEM_VARS),
  '$1',
  '$2',
  '$3',
  '$4',
  '$5',
  '$6',
  '$7',
  '$8',
  '$9',
  '$expected',
  '$model',
  '$val',
];

module.exports = {
  getVars,
  getVarsKeys,
  SYSTEM_VARS,
};
