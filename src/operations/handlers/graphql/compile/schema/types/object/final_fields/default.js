'use strict';

const { isInlineFunc } = require('../../../../../../../../idl_func');

const getDefaultValue = function (
  { command, default: defaultValue },
  { inputObjectType },
) {
  // 'patch' does not require anything, nor assign defaults
  const hasDefaultValue = inputObjectType === 'data' &&
    command.type !== 'patch' &&
    defaultValue;
  if (!hasDefaultValue) { return; }

  // IDL function are skipped
  const isDynamic = typeof defaultValue === 'function' ||
    isInlineFunc({ inlineFunc: defaultValue });
  return isDynamic ? undefined : defaultValue;
};

module.exports = {
  getDefaultValue,
};
