'use strict';

const { uniq } = require('lodash');

const {
  assignArray,
  mergeArrayReducer,
  mapValues,
} = require('../../../../utilities');

// Retrieve `deepKeys` which are the sets of attributes, for each model,
// that initiated a nested action.
// I.e. in `args.data` { model: 1, other_model: { ... }, not_model: { ... } }
// `model` and `not_model` would not be included, but `other_model` would.
// This is used e.g. by attr.transform|value:
//  - if a nested action was created with an attribute, this attribute should
//    be stable, i.e. attr.transform|value should not modify it.
//    Otherwise, the relation between the two models returned to the client
//    is not the one actually used
//  - we use `deepKeys` to check if the attribute is stable,
//    and throw otherwise
const getDeepKeys = function ({ actions, top, newData }) {
  const deepKeys = actions
    .map(({ args }) => addIds({ args, top }))
    .reduce(assignArray, [])
    // Group by model.id
    .reduce(mergeArrayReducer('id'), {});
  const deepKeysA = mapValues(deepKeys, mergeKeys);
  // Reorder `deepKeys` to follow `newData` after duplicate removal
  const deepKeysB = newData.map(({ id }) => deepKeysA[id]);
  return deepKeysB;
};

// Add model.id related to each set of `deepKeys`
const addIds = function ({ args, top }) {
  return args.data
    .map(({ id }, index) => addId({ id, index, top, args }));
};

const addId = function ({ id, index, top: { command }, args }) {
  // With 'patch' command, `args.deepKeys` length will
  // always be 1, because it was calculated before 'patch' merging.
  const indexA = command.type === 'patch' ? 0 : index;
  const keys = args.deepKeys[indexA];
  return { id, keys };
};

// Concatenate all `deepKeys`
const mergeKeys = function (array) {
  const arrayA = array
    .map(({ keys }) => keys)
    .reduce(assignArray, []);
  return uniq(arrayA);
};

module.exports = {
  getDeepKeys,
};
