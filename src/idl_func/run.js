'use strict';

const { addErrorHandler } = require('../error');

const { bindHelpers } = require('./helpers');

// Process (already compiled) IDL function, i.e. fires it and returns its value
const runIdlFunc = function ({
  idlFunc,
  input,
  input: { paramsRef, helpers },
  params,
}) {
  // If this is not IDL function, returns as is
  if (typeof idlFunc !== 'function') { return idlFunc; }

  const ifv = getIfv(input);
  const paramsA = { ...helpers, ...ifv, ...params };
  bindHelpers({ paramsRef, params: paramsA });

  return idlFunc(paramsA);
};

const getIfv = function ({
  protocol: $PROTOCOL,
  args: $ARGS,
  modelName: $MODEL,
  command: { type: $COMMAND } = {},
  operation: $OPERATION,
  ip: $IP,
  requestId: $REQUEST_ID,
  settings: $SETTINGS,
  params: $PARAMS,
  timestamp: $NOW,
}) {
  return {
    $PROTOCOL,
    $ARGS,
    $MODEL,
    $COMMAND,
    $OPERATION,
    $IP,
    $REQUEST_ID,
    $SETTINGS,
    $PARAMS,
    $NOW,
  };
};

const eRunIdlFunc = addErrorHandler(runIdlFunc, {
  message: ({ idlFunc }) =>
    `IDL function failed: '${stringifyIdlFunc({ idlFunc })}'`,
  reason: 'UTILITY_ERROR',
});

const stringifyIdlFunc = function ({ idlFunc, idlFunc: { inlineFunc, name } }) {
  if (inlineFunc) { return inlineFunc; }

  if (!name || name === 'anonymous') { return idlFunc.toString(); }

  return `${name}()`;
};

module.exports = {
  runIdlFunc: eRunIdlFunc,
};
