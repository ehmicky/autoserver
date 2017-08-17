'use strict';

// Retrieve IDL params names
const getParamsKeys = function ({ idl: { helpers = {} } }) {
  return [...PARAMS_KEYS, ...Object.keys(helpers)];
};

const PARAMS_KEYS = [
  '$PROTOCOL',
  '$NOW',
  '$REQUEST_ID',
  '$IP',
  '$SETTINGS',
  '$PARAMS',
  '$OPERATION',
  '$MODEL',
  '$ARGS',
  '$COMMAND',
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
  getParamsKeys,
};
