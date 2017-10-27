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

// 'patch' does not require anything, nor assign defaults
const isNotPatchData = function ({ command }) {
  return command.type !== 'patch';
};

// Schema function are skipped
const isStatic = function (def) {
  return typeof def.default !== 'function' &&
    !isInlineFunc({ inlineFunc: def.default });
};

// TODO: if requiring /src/schema_funcs, there is a circular dependencies,
// because getVars() in schemaFuncs needs to require /src/operations,
// to validate $operation is a possible operation.
// This should be fixed once separating operations into different repositories.
const isInlineFunc = function ({ inlineFunc }) {
  return typeof inlineFunc === 'string' &&
    inlineFunc.startsWith('(') &&
    inlineFunc.endsWith(')');
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
