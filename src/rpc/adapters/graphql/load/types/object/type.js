'use strict';

const { GraphQLObjectType, GraphQLInputObjectType } = require('graphql');

const { memoize } = require('../../../../../../utilities');
const { getTypeName } = require('../../name');

const { getObjectFields } = require('./fields');

// Object field TGetter
const graphqlObjectTGetter = function (def, opts) {
  const Type = opts.inputObjectType === 'type'
    ? GraphQLObjectType
    : GraphQLInputObjectType;

  const name = getTypeName({ def, opts });
  const { description } = def;

  // This needs to be a function, otherwise we run in an infinite recursion,
  // if the children try to reference a parent type
  const fields = getObjectFields.bind(null, { ...opts, parentDef: def });

  const type = new Type({ name, description, fields });
  return type;
};

// Memoize object type constructor in order to infinite recursion.
// We use the type name, i.e.:
//  - type name must differ everytime type might differ
//  - in particular, at the moment, type name differ when inputObjectType
//    or command changes
// We also namespace with a UUID which is unique for each new call to
// `getGraphqlSchema()`, to avoid leaking
const serializer = function ([def, opts]) {
  const typeName = getTypeName({ def, opts });
  return `${opts.graphqlSchemaId}/${typeName}`;
};

const mGraphqlObjectTGetter = memoize(graphqlObjectTGetter, { serializer });

module.exports = {
  graphqlObjectTGetter: mGraphqlObjectTGetter,
};
