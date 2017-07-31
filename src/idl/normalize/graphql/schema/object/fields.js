'use strict';

const { GraphQLString } = require('graphql');

const { omitBy, mapValues } = require('../../../../../utilities');
const { getRequired } = require('../required');

const { getNestedModels } = require('./nested_models');
const { filterArgs } = require('./filter_args');

// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (def, opts, getField) {
  const { action = {}, inputObjectType, rootDef } = opts;

  // This needs to be function, otherwise we run in an infinite recursion,
  // if the children try to reference a parent type
  return () => {
    const fieldsWithNested = Object.entries(def.properties)
      .map(([childDefName, childDef]) => getNestedModels({
        childDef,
        childDefName,
        inputObjectType,
        action,
        def,
        rootDef,
      }))
      .reduce((memo, value) => Object.assign({}, memo, ...value), {});
    const filteredFields = omitBy(fieldsWithNested, (childDef, childDefName) =>
      filterArgs({ childDef, childDefName, inputObjectType, action, def })
    );
    const finalFields = mapValues(filteredFields, (childDef, childDefName) =>
      getChildField({ childDef, childDefName, action, def, opts, getField })
    );
    const fieldsWithDefault = Object.keys(finalFields).length === 0
      ? noAttributes
      : finalFields;
    return fieldsWithDefault;
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
  const childOpts = { ...opts, action: childAction };

  const isRequired = getRequired({
    parentDef: def,
    name: childDefName,
    ...childOpts,
  });
  const childOptsA = { ...childOpts, isRequired };

  const field = getField(childDef, childOptsA);
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
