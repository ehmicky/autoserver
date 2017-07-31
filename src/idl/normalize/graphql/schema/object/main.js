'use strict';

const { GraphQLObjectType, GraphQLInputObjectType } = require('graphql');

const { memoize } = require('../../../../../utilities');
const { getTypeName } = require('../name');

const { getObjectFields } = require('./fields');

/**
 * Memoize object type constructor in order to infinite recursion.
 * We use the type name, i.e.:
 *  - type name must differ everytime type might differ
 *  - in particular, at the moment, type name differ when inputObjectType,
 *    action.type or multiple changes
 * We also namespace with a UUID which is unique for each new call to
 * `getSchema()`, to avoid leaking
 **/
const objectTypeSerializer = function ([def, opts]) {
  const typeName = getTypeName({ def, opts });
  return `${opts.schemaId}/${typeName}`;
};

// Object field FGetter
const graphQLObjectFGetter = memoize((def, opts, getField) => {
  const name = getTypeName({ def, opts });
  const { description } = def;
  const Type = opts.inputObjectType === ''
    ? GraphQLObjectType
    : GraphQLInputObjectType;
  const fields = getObjectFields(def, opts, getField);

  const type = new Type({ name, description, fields });
  return { type };
}, { serializer: objectTypeSerializer });

module.exports = {
  graphQLObjectFGetter,
};
