'use strict';

const { GraphQLNonNull } = require('graphql');

// Required field FGetter
const graphQLRequiredFGetter = function (def, opts, getField) {
  // Goal is to avoid infinite recursion,
  // i.e. without modification the same graphQLFGetter would be hit again
  const fieldOpts = { ...opts, isRequired: false };
  const { type: subType, args } = getField(def, fieldOpts);
  const type = new GraphQLNonNull(subType);
  return { type, args };
};

// Returns whether a field is required
const getRequired = function ({ def, defName, action = {}, inputObjectType }) {
  // Filter inputObjects `id` attribute is always required
  const isFilterId = defName === 'id' &&
    inputObjectType === 'filter' &&
    !action.multiple;
  const { required } = def.validate || {};
  const shouldRequire =
    (required || isFilterId) &&
    // Query inputObjects do not require any attribute,
    // except filter.id for single actions
    !(inputObjectType === 'filter' && !isFilterId) &&
    // `updateOne|updateMany` does not require any attribute in input object
    !(inputObjectType === 'data' && action.type === 'update') &&
    // `data.id` is optional in createOne|createMany
    !(
      inputObjectType === 'data' &&
      action.type === 'create' &&
      defName === 'id'
    );
  return shouldRequire;
};

module.exports = {
  graphQLRequiredFGetter,
  getRequired,
};
