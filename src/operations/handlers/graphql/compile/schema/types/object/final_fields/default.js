'use strict';

const getDefaultValue = function (
  { command, default: defaultValue },
  { inputObjectType },
) {
  // 'patch' does not required anything, nor assign defaults
  const hasDefaultValue = inputObjectType === 'data' &&
    command.type !== 'patch' &&
    defaultValue;
  if (!hasDefaultValue) { return; }

  // IDL function only shows as 'DYNAMIC_VALUE' in schema
  const isDynamic = typeof defaultValue === 'function';
  return isDynamic ? undefined : defaultValue;
};

module.exports = {
  getDefaultValue,
};
