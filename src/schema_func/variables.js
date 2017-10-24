'use strict';

// Retrieve schema functions variables, using the request mInput
// Also add helpers, and call-specific variables
const getVars = function (
  {
    protocol: $PROTOCOL,
    timestamp: $TIMESTAMP,
    ip: $IP,
    requestId: $REQUEST_ID,
    operation: $OPERATION,
    modelName: $MODEL,
    topArgs: $ARGS,
    topArgs: { params: $PARAMS = {} },
    command: $COMMAND,
  },
  {
    vars,
    helpers,
  },
) {
  return {
    ...helpers,
    $PROTOCOL,
    $TIMESTAMP,
    $IP,
    $REQUEST_ID,
    $OPERATION,
    $MODEL,
    $ARGS,
    $COMMAND,
    $PARAMS,
    ...vars,
  };
};

// Retrieve schema functions variables names
const getVarsKeys = function ({ schema: { helpers = {} } }) {
  return [...VARS_KEYS, ...Object.keys(helpers)];
};

const VARS_KEYS = [
  '$PROTOCOL',
  '$TIMESTAMP',
  '$IP',
  '$REQUEST_ID',
  '$OPERATION',
  '$MODEL',
  '$ARGS',
  '$COMMAND',
  '$PARAMS',
  '$EXPECTED',
  '$1',
  '$2',
  '$3',
  '$4',
  '$5',
  '$6',
  '$7',
  '$8',
  '$9',
  '$$',
  '$',
];

module.exports = {
  getVars,
  getVarsKeys,
};
