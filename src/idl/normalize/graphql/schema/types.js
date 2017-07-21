'use strict';

const { isJsl } = require('../../../../jsl');

const { isModel } = require('./utilities');
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
  opts.inputObjectType = opts.inputObjectType || '';

  const fieldGetter = getFieldGetter({ def, opts });
  const { type, args: oArgs } = fieldGetter.value(def, opts, getField);

  // Fields description|deprecation_reason are taken from IDL definition
  const { description, deprecationReason } = def;

  const args = getArgs({ oArgs, def, opts });

  const defaultValue = getDefaultValue({ def, opts });
  const field = { type, description, deprecationReason, args, defaultValue };
  return field;
};

const getArgs = function ({ oArgs, def, opts }) {
  // Only for models, and not for argument types
  // Modifiers (Array and NonNull) retrieve their arguments from
  // underlying type (i.e. `args` is already defined)
  if (!isModel(def) || opts.inputObjectType !== '' || oArgs) {
    return oArgs;
  }

  // Builds types used for `data` and `filter` arguments
  const dataObjectOpts = Object.assign({}, opts, { inputObjectType: 'data' });
  const dataObjectType = getType(def, dataObjectOpts);
  const filterObjectOpts = Object.assign({}, opts, {
    inputObjectType: 'filter',
  });
  const filterObjectType = getType(def, filterObjectOpts);
  // Retrieves arguments
  const argsOpts = Object.assign({}, opts, {
    dataObjectType,
    filterObjectType,
  });

  return getArguments(def, argsOpts);
};

const getDefaultValue = function ({
  def,
  opts: { isRequired: isRequiredOpt, inputObjectType, action },
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
