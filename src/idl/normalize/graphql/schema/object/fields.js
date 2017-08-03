'use strict';

const { GraphQLString } = require('graphql');

const { omitBy, mapValues } = require('../../../../../utilities');
const { getRequired } = require('../required');

const { getNestedModels } = require('./nested_models');
const { filterArgs } = require('./filter_args');

// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (parentDef, opts, getField) {
  const { inputObjectType, topDef } = opts;

  // This needs to be function, otherwise we run in an infinite recursion,
  // if the children try to reference a parent type
  return () => {
    const fieldsA = Object.entries(parentDef.attributes)
      .map(([defName, def]) => getNestedModels({
        parentDef,
        def,
        defName,
        inputObjectType,
        topDef,
      }))
      .reduce((memo, value) => Object.assign({}, memo, ...value), {});
    const fieldsB = omitBy(fieldsA, (def, defName) =>
      filterArgs({ def, defName, inputObjectType, parentDef })
    );
    const fieldsC = mapValues(fieldsB, (def, defName) =>
      getChildField({ parentDef, def, defName, opts, getField })
    );
    const fieldsD = Object.keys(fieldsC).length === 0 ? noAttributes : fieldsC;
    return fieldsD;
  };
};

// Recurse over children
const getChildField = function ({ parentDef, def, defName, opts, getField }) {
  const kind = parentDef.kind === 'graphqlMethod' ? 'model' : 'attribute';
  const defA = { ...def, kind };

  const isRequired = getRequired({ def: defA, defName, ...opts });

  const field = getField(defA, { ...opts, isRequired });

  // Use the nested attribute's metadata, if this is a nested attribute
  const { metadata = {} } = defA;
  const fieldA = { ...field, ...metadata };

  return fieldA;
};

// GraphQL requires every object field to have attributes,
// which does not always makes sense for us.
// So we add this patch this problem by adding this fake attribute
// when the problem arises.
const noAttributes = {
  no_attributes: {
    type: GraphQLString,
    description: `This type does not have any attributes.
This is a dummy attribute.`,
  },
};

module.exports = {
  getObjectFields,
};
