'use strict';

const { getDefaultValue } = require('./default');
const { getArgs } = require('./args');
const { getMetadata } = require('./metadata');

// Retrieves a GraphQL field info for a given IDL definition,
// i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getFinalField = function (def, opts) {
  const type = opts.getType(def, opts);
  const args = getArgs(def, opts);
  const defaultValue = getDefaultValue(def, opts);
  const { description, deprecationReason } = getMetadata(def);

  return { type, description, deprecationReason, args, defaultValue };
};

module.exports = {
  getFinalField,
};
