'use strict';

const { GraphQLNonNull } = require('graphql');

// Required field FGetter
const graphQLRequiredFGetter = function (def, opts, getField) {
  // Goal is to avoid infinite recursion,
  // i.e. without modification the same graphQLFGetter would be hit again
  const fieldOpts = Object.assign({}, opts, { isRequired: false });
  const { type: subType, args } = getField(def, fieldOpts);
  const type = new GraphQLNonNull(subType);
  return { type, args };
};

// Returns whether a field is required
const isRequired = function ({
  parentDef,
  name,
  action = {},
  inputObjectType,
}) {
  // Filter inputObjects `id` attribute is always required
  const isFilterId = name === 'id' &&
    inputObjectType === 'filter' &&
    !action.multiple;
  const shouldRequire = isFilterId ||
    // When user declared an attribute as required
    (Array.isArray(parentDef.required) && parentDef.required.includes(name));
  const shouldNotRequire = (
    // Query inputObjects do not require any attribute,
    // except filter.id for single actions
    inputObjectType === 'filter' &&
      !isFilterId
    // `updateOne|updateMany` does not require any attribute in input object
  ) || (
      inputObjectType === 'data' &&
      action.type === 'update'
    // `data.id` is optional in createOne|createMany
    ) || (
      inputObjectType === 'data' &&
      action.type === 'create' &&
      name === 'id'
    );
  return shouldRequire && !shouldNotRequire;
};

module.exports = {
  graphQLRequiredFGetter,
  isRequired,
};
