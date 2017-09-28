'use strict';

// Retrieve IDL functions variables, using the request mInput
const getVars = function (
  {
    protocol: $PROTOCOL,
    timestamp: $TIMESTAMP,
    ip: $IP,
    requestId: $REQUEST_ID,
    operation: $OPERATION,
    modelName: $MODEL,
    topArgs: $ARGS,
    command: $COMMAND,
    params: $PARAMS,
  },
  vars,
) {
  return {
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

// Retrieve IDL functions variables names
const getVarsKeys = function ({ idl: { helpers = {} } }) {
  const helpersA = Array.isArray(helpers)
    ? Object.assign({}, ...helpers)
    : helpers;

  return {
    vars: VARS_KEYS,
    helpers: Object.keys(helpersA),
  };
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
