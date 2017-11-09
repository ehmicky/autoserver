'use strict';

const { assignArray, isEqual, uniq } = require('../../utilities');
const { getSimpleFilter } = require('../../filter');

// Retrieve the results of all direct parent commands
// E.g. when firing `find_collection { child { id } }`,
// the nested `child` action needs to know `model.child` first before being
// fired.
const getParentResults = function ({ commandpath, results }) {
  const parentPath = commandpath.slice(0, -1);
  return results.filter(result => isParentResults({ result, parentPath }));
};

const isParentResults = function ({ result: { path, promise }, parentPath }) {
  if (promise !== undefined) { return false; }

  const pathA = path.filter(index => typeof index !== 'number');
  return isEqual(pathA, parentPath);
};

// Reduce parent results to only the information the child needs: the `id`s
// related to its own action.
// If the parent is an *Many command, `parentResults` will be an array.
// `nestedParentIds` keep that nesting, `parentIds` flattens it.
// `nestedParentIds` is useful to assemble results back, while `parentIds` is
// useful to build `args.filter`.
const getParentIds = function ({ commandName, parentResults }) {
  const nestedParentIds = parentResults.map(({ model }) => model[commandName]);
  const parentIds = nestedParentIds
    .reduce(assignArray, [])
    .filter(ids => ids !== undefined);
  // We remove duplicate `id`, for efficiency reasons
  const parentIdsA = uniq(parentIds);

  return { nestedParentIds, parentIds: parentIdsA };
};

// Make nested collections filtered by their parent model
// E.g. if a model find_parent() returns { child: 1 },
// then a nested query find_child() will be filtered by `id: 1`
// If the parent returns nothing|null, the nested query won't be performed
// and null will be returned
const addNestedFilter = function ({ args, isTopLevel, parentIds }) {
  if (isTopLevel) { return args; }

  const filter = getSimpleFilter({ ids: parentIds });
  return { ...args, filter };
};

module.exports = {
  getParentResults,
  getParentIds,
  addNestedFilter,
};
