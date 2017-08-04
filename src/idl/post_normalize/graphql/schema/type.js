'use strict';

const { getTypeGetter } = require('./types');
const { getArgs } = require('./args');
const { getDefaultValue } = require('./default');

// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  // Recursion, while avoiding files circular dependencies
  const optsA = { ...opts, getField, getType };

  const typeGetter = getTypeGetter({ def, opts: optsA });
  const type = typeGetter.value(def, optsA);
  return type;
};

// Retrieves a GraphQL field info for a given IDL definition,
// i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  const type = getType(def, opts);

  // Fields description|deprecation_reason are taken from IDL definition
  const { description, deprecation_reason: deprecationReason } = def;

  const argsA = getArgs({ def, opts });

  const defaultValue = getDefaultValue({ def, opts });

  const field = {
    type,
    description,
    deprecationReason,
    args: argsA,
    defaultValue,
  };
  return field;
};

module.exports = {
  getType,
};
