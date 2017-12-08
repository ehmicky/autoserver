'use strict';

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

// Only applied when model is created, e.g. on `create` or `upsert`
const isNotPatchData = function ({ command }) {
  return DEFAULT_COMMANDS.includes(command);
};

const DEFAULT_COMMANDS = ['create', 'upsert'];

// Schema function are skipped
const isStatic = function (def) {
  return typeof def.default !== 'function';
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
