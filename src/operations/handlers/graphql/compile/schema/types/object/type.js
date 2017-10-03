'use strict';

const { GraphQLObjectType, GraphQLInputObjectType } = require('graphql');

const { memoize } = require('../../../../../../../utilities');
const { getTypeName } = require('../../name');

const { getObjectFields } = require('./fields');

// Object field TGetter
const graphQLObjectTGetter = function (def, opts) {
  const name = getTypeName({ def, opts });
  const { description } = def;

  const Type = opts.inputObjectType === 'type'
    ? GraphQLObjectType
    : GraphQLInputObjectType;
  const fields = getObjectFields(def, opts);

  const type = new Type({ name, description, fields });
  return type;
};

// Memoize object type constructor in order to infinite recursion.
// We use the type name, i.e.:
//  - type name must differ everytime type might differ
//  - in particular, at the moment, type name differ when inputObjectType,
//    command.type or multiple changes
// We also namespace with a UUID which is unique for each new call to
// `getSchema()`, to avoid leaking
const objectTypeSerializer = function ([def, opts]) {
  const typeName = getTypeName({ def, opts });
  return `${opts.schemaId}/${typeName}`;
};

const mGraphQLObjectTGetter = memoize(graphQLObjectTGetter, {
  serializer: objectTypeSerializer,
});

module.exports = {
  graphQLObjectTGetter: mGraphQLObjectTGetter,
};
