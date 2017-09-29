'use strict';

const getDefaultValue = function ({
  def,
  def: { action },
  opts: { inputObjectType },
}) {
  // 'patch' does not required anything, nor assign defaults
  const hasDefaultValue = inputObjectType === 'data' &&
    action.type !== 'patch' &&
    def.default;
  if (!hasDefaultValue) { return; }

  const defaults = Array.isArray(def.default) ? def.default : [def.default];
  // IDL function only shows as 'DYNAMIC_VALUE' in schema
  const isDynamic = defaults.some(
    inlineFunc => typeof inlineFunc === 'function'
  );
  return isDynamic ? undefined : def.default;
};

module.exports = {
  getDefaultValue,
};
