'use strict';

const { v4: uuidv4 } = require('uuid');

const { mapValues } = require('../../../../../utilities');

const { getTypeGetter } = require('./types');

// Builds query|mutation type
const getTopTypes = function ({ topDefs }) {
  const schemaId = uuidv4();

  return mapValues(
    topDefs,
    topDef => getType(topDef, { topDef, schemaId, inputObjectType: 'type' }),
  );
};

// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  // Recursion, while avoiding files circular dependencies
  const optsA = { ...opts, getType };

  const typeGetter = getTypeGetter({ def, opts: optsA });
  const type = typeGetter.value(def, optsA);
  return type;
};

module.exports = {
  getTopTypes,
};
