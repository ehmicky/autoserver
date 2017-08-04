'use strict';

const { GraphQLNonNull } = require('graphql');

// Returns whether a field is required
const graphQLRequiredTest = function (def, opts) {
  return !requiredTests.some(testFunc => testFunc(def, opts));
};

// Already wrapped in Required type
const isWrapped = function ({ requiredWrapped }) {
  return requiredWrapped;
};

// `attr.validate.required` must be true
const isNotRequiredValidated = function ({ validate = {} }) {
  return !validate.required;
};

// `args.filter` fields are never required, except `id` for single actions
const isFilterArg = function ({ action }, { defName, inputObjectType }) {
  const isSimpleId = defName === 'id' && !action.multiple;
  return inputObjectType === 'filter' && !isSimpleId;
};

// `updateOne|updateMany` does not require any attribute in `args.data`
const isUpdateArg = function ({ action }, { inputObjectType }) {
  return inputObjectType === 'data' && action.type === 'update';
};

// `data.id` is optional in createOne|createMany
const isCreateId = function ({ action }, { defName, inputObjectType }) {
  return inputObjectType === 'data' &&
    action.type === 'create' &&
    defName === 'id';
};

const requiredTests = [
  isWrapped,
  isNotRequiredValidated,
  isFilterArg,
  isUpdateArg,
  isCreateId,
];

// Required field TGetter
const graphQLRequiredTGetter = function (def, opts) {
  const defA = { ...def, requiredWrapped: true };
  const subType = opts.getType(defA, opts);
  const type = new GraphQLNonNull(subType);
  return type;
};

module.exports = {
  graphQLRequiredTGetter,
  graphQLRequiredTest,
};
