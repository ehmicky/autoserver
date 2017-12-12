'use strict';

const { v4: uuidv4 } = require('uuid');

const { mapValues } = require('../../../../utilities');

const { getTypeGetter } = require('./types');

// Builds query|mutation type
const getTopTypes = function ({ topDefs }) {
  const graphqlSchemaId = uuidv4();
  // `getType`: recursion, while avoiding files circular dependencies
  const opts = {
    inputObjectType: 'type',
    getType,
    graphqlSchemaId,
  };

  return mapValues(
    topDefs,
    topDef => getType(topDef, { ...opts, topDef }),
  );
};

// Retrieves the GraphQL type for a given config definition
const getType = function (def, opts) {
  const typeGetter = getTypeGetter(def, opts);
  const type = typeGetter.value(def, opts);
  return type;
};

module.exports = {
  getTopTypes,
};
