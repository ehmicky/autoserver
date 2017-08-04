'use strict';

const { GraphQLString } = require('graphql');

const { omitBy, mapValues } = require('../../../../../../utilities');
const { ACTIONS } = require('../../../../../../constants');

const { getNestedModels } = require('./nested_models');
const { filterArgs } = require('./filter_args');
const { getDefaultValue } = require('./default');
const { getArgs } = require('./args');

// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (parentDef, opts) {
  const { inputObjectType, topDef } = opts;

  // This needs to be function, otherwise we run in an infinite recursion,
  // if the children try to reference a parent type
  return () => {
    const fields = parentDef.attributes;
    const fieldsA = mapValues(fields, def => addAction({ def, parentDef }));
    const fieldsB = Object.entries(fieldsA)
      .map(([defName, def]) => getNestedModels({
        parentDef,
        def,
        defName,
        inputObjectType,
        topDef,
      }))
      .reduce((memo, value) => Object.assign({}, memo, ...value), {});
    const fieldsC = omitBy(fieldsB, (def, defName) =>
      filterArgs({ def, defName, inputObjectType, parentDef })
    );
    const fieldsD = mapValues(fieldsC, (def, defName) =>
      getChildField({ parentDef, def, defName, opts })
    );
    const fieldsE = Object.keys(fieldsD).length === 0 ? noAttributes : fieldsD;
    return fieldsE;
  };
};

// Nested attributes change current action
const addAction = function ({ def, parentDef }) {
  if (def.action) { return def; }

  const action = ACTIONS.find(ACTION =>
    ACTION.type === parentDef.action.type &&
    ACTION.multiple === def.isArray
  );
  return { ...def, action };
};

// Recurse over children
const getChildField = function ({ parentDef, def, defName, opts }) {
  const kind = parentDef.kind === 'graphqlMethod' ? 'model' : 'attribute';
  const defA = { ...def, kind };

  const field = getField(defA, { ...opts, defName });

  // Use the nested attribute's metadata, if this is a nested attribute
  const { metadata = {} } = defA;
  const fieldA = { ...field, ...metadata };

  return fieldA;
};

// Retrieves a GraphQL field info for a given IDL definition,
// i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  const type = opts.getType(def, opts);

  // Fields description|deprecation_reason are taken from IDL definition
  const { description, deprecation_reason: deprecationReason } = def;

  const argsA = getArgs({ def, opts });

  const defaultValue = getDefaultValue({ def, opts });

  const field = {
    type,
    description,
    deprecationReason,
    args: argsA,
    defaultValue,
  };
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
