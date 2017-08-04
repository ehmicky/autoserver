'use strict';

const { GraphQLNonNull } = require('graphql');

// Required field TGetter
const graphQLRequiredTGetter = function (def, opts) {
  // Goal is to avoid infinite recursion,
  // i.e. without modification the same graphQLTGetter would be hit again
  const fieldOpts = { ...opts, isRequired: false };
  const subType = opts.getType(def, fieldOpts);
  const type = new GraphQLNonNull(subType);
  return type;
};

// Returns whether a field is required
const getRequired = function ({
  def,
  def: { action },
  defName,
  inputObjectType,
}) {
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
  graphQLRequiredTGetter,
  getRequired,
};
