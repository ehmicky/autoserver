'use strict';

const { mapValues } = require('../../../../../../../utilities');

const { getDefaultValue } = require('./default');
const { getArgs } = require('./args');

const getFinalFields = function ({ fields, opts }) {
  return mapValues(fields, (def, defName) =>
    getField({ def, opts: { ...opts, defName } })
  );
};

// Retrieves a GraphQL field info for a given IDL definition,
// i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function ({ def, opts }) {
  const type = opts.getType(def, opts);

  const args = getArgs({ def, opts });

  const defaultValue = getDefaultValue({ def, opts });

  // Fields description|deprecation_reason are taken from IDL definition
  // Use the nested attribute's metadata, if this is a nested attribute
  const { metadata = {} } = def;
  const {
    description,
    deprecation_reason: deprecationReason,
  } = { ...def, ...metadata };

  const defA = { type, description, deprecationReason, args, defaultValue };
  return defA;
};

module.exports = {
  getFinalFields,
};
