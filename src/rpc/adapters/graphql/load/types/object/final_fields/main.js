'use strict';

const { getDefaultValue } = require('./default');
const { getArgs } = require('./args');

// Retrieves a GraphQL field info for a given config definition,
// i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getFinalField = function (def, opts) {
  const type = opts.getType(def, opts);

  const args = getArgs(def, opts);

  const defaultValue = getDefaultValue(def, opts);

  // `commandDescription` will only be used with top-level actions
  const description = def.commandDescription || def.description;
  const { deprecation_reason: deprecationReason } = def;

  return { type, args, defaultValue, description, deprecationReason };
};

module.exports = {
  getFinalField,
};
