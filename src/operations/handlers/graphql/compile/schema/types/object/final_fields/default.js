'use strict';

const { isInlineFunc } = require('../../../../../../../../schema_func');

const getDefaultValue = function (def, opts) {
  const shouldSetDefault = defaultValueTests.every(func => func(def, opts));
  if (!shouldSetDefault) { return; }

  return def.default;
};

const hasDefaultValue = function (def) {
  return def.default != null;
};

// Only for `args.data`
const isDataArgument = function (def, { inputObjectType }) {
  return inputObjectType === 'data';
};

// 'patch' does not require anything, nor assign defaults
const isNotPatchData = function ({ command }) {
  return command.type !== 'patch';
};

// Schema function are skipped
const isStatic = function (def) {
  return typeof def.default !== 'function' &&
    !isInlineFunc({ inlineFunc: def.default });
};

const defaultValueTests = [
  hasDefaultValue,
  isDataArgument,
  isNotPatchData,
  isStatic,
];

module.exports = {
  getDefaultValue,
};
