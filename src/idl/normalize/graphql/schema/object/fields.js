'use strict';

const { GraphQLString } = require('graphql');
const { chain } = require('lodash');

const { isRequired } = require('../required');

const { getNestedModels } = require('./nested_models');
const { getRecursiveModels } = require('./recursive_models');
const { filterArgs } = require('./filter_args');

// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (def, opts, getField) {
  const { action = {}, inputObjectType, rootDef } = opts;

  // This needs to be function, otherwise we run in an infinite recursion,
  // if the children try to reference a parent type
  return () => {
    const objectFields = chain(def.properties)
      .mapValues(childDef => getRecursiveModels({ childDef, rootDef }))
      .transform((memo, childDef, childDefName) => {
        const newAttrs = getNestedModels({
          childDef,
          childDefName,
          inputObjectType,
          action,
          def,
        });
        Object.assign(memo, newAttrs);
        return memo;
      })
      .omitBy((childDef, childDefName) =>
        filterArgs({ childDef, childDefName, inputObjectType, action, def })
      )
      .mapValues((childDef, childDefName) =>
        getChildField({ childDef, childDefName, action, def, opts, getField })
      )
      .value();
    return Object.keys(objectFields).length === 0 ? noAttributes : objectFields;
  };
};

// Recurse over children
const getChildField = function ({
  childDef,
  childDefName,
  action,
  def,
  opts,
  getField,
}) {
  // If 'Query' or 'Mutation' objects, pass current action down to
  // sub-fields, and top-level definition
  const childAction = childDef.action || action;
  const childOpts = Object.assign({}, opts, { action: childAction });

  childOpts.isRequired = isRequired(Object.assign({
    parentDef: def,
    name: childDefName,
  }, childOpts));

  const field = getField(childDef, childOpts);
  return field;
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
