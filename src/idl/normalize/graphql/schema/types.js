'use strict';

const { isJsl } = require('../../../../jsl');

const { getArguments } = require('./arguments');
const { getFieldGetter } = require('./fields');

// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts = {}) {
  return getField(def, opts).type;
};

// Retrieves a GraphQL field info for a given IDL definition,
// i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  const inputObjectType = opts.inputObjectType || '';
  const optsA = { ...opts, inputObjectType };

  const fieldGetter = getFieldGetter({ def, opts: optsA });
  const { type, args } = fieldGetter.value(def, optsA, getField);

  // Fields description|deprecation_reason are taken from IDL definition
  const { description, deprecation_reason: deprecationReason } = def;

  const argsA = getArgs({ args, def, opts: optsA });

  const defaultValue = getDefaultValue({ def, opts: optsA });
  const field = {
    type,
    description,
    deprecationReason,
    args: argsA,
    defaultValue,
  };
  return field;
};

const getArgs = function ({ args, def, opts }) {
  // Only for models, and not for argument types
  // Modifiers (Array and NonNull) retrieve their arguments from
  // underlying type (i.e. `args` is already defined)
  const noArgs = def.model === undefined ||
    opts.inputObjectType !== '' ||
    args;
  if (noArgs) { return args; }

  // Builds types used for `data` and `filter` arguments
  const dataObjectType = getType(def, { ...opts, inputObjectType: 'data' });
  const filterObjectType = getType(def, { ...opts, inputObjectType: 'filter' });

  // Retrieves arguments
  return getArguments(def, { ...opts, dataObjectType, filterObjectType });
};

const getDefaultValue = function ({
  def,
  def: { action },
  opts: { isRequired: isRequiredOpt, inputObjectType },
}) {
  // Can only assign default to input data that is optional.
  // 'update' does not required anything, nor assign defaults
  const hasDefaultValue = !isRequiredOpt &&
    inputObjectType === 'data' &&
    action.type !== 'update' &&
    def.default;
  if (!hasDefaultValue) { return; }

  // JSL only shows as 'DYNAMIC_VALUE' in schema
  const defaults = Array.isArray(def.default) ? def.default : [def.default];
  const isDynamic = defaults.some(jsl =>
    isJsl({ jsl }) || typeof jsl === 'function'
  );
  return isDynamic ? 'DYNAMIC_VALUE' : def.default;
};

module.exports = {
  getType,
};
