'use strict';

// Retrieve schema functions variables, using the request mInput
// Also add helpers, and call-specific variables
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
    vars,
    helpers,
  },
) {
  return {
    ...helpers,
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
const getVarsKeys = function ({ schema: { helpers = {} } }) {
  return [...VARS_KEYS, ...Object.keys(helpers)];
};

const VARS_KEYS = [
  '$protocol',
  '$timestamp',
  '$ip',
  '$requestId',
  '$operation',
  '$modelName',
  '$args',
  '$command',
  '$params',
  '$expected',
  '$1',
  '$2',
  '$3',
  '$4',
  '$5',
  '$6',
  '$7',
  '$8',
  '$9',
  '$model',
  '$val',
];

module.exports = {
  getVars,
  getVarsKeys,
};
