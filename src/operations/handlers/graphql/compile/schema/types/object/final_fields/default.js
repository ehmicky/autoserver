'use strict';

const { isInlineFunc } = require('../../../../../../../../idl_func');

const getDefaultValue = function (def, opts) {
  const shouldSetDefault = defaultValueTests.every(func => func(def, opts));
  if (!shouldSetDefault) { return; }

  return def.default;
};

const hasDefaultValue = function (def) {
  return def.default != null;
};

// 'patch' does not require anything, nor assign defaults
const isNotPatchData = function ({ command }, { inputObjectType }) {
  return !(inputObjectType === 'data' && command.type === 'patch');
};

// IDL function are skipped
const isStatic = function (def) {
  return typeof def.default !== 'function' &&
    !isInlineFunc({ inlineFunc: def.default });
};

const defaultValueTests = [
  hasDefaultValue,
  isNotPatchData,
  isStatic,
];

module.exports = {
  getDefaultValue,
};
