'use strict';

const { assignArray } = require('../../utilities');

// Normalize results to an object with `path`, `model`, `moodelName`, `select`
// Then push to shared `results` variable
const processResults = function ({
  results,
  finishedResults,
  pendingResults,
  ...rest
}) {
  const finishedResultsA = finishedResults.reduce(assignArray, []);

  const finishedResultsB = getResults({ ...rest, results: finishedResultsA });

  // Replace `pendingResults` promises by their resolved values
  if (pendingResults.length > 0) {
    const index = results.findIndex(result => pendingResults.includes(result));
    // eslint-disable-next-line fp/no-mutating-methods
    results.splice(index, pendingResults.length);
  }

  // eslint-disable-next-line fp/no-mutating-methods
  results.push(...finishedResultsB);
};

const getResults = function ({
  action,
  commandName,
  isTopLevel,
  parentResults,
  nestedParentIds,
  results,
}) {
  if (isTopLevel) {
    return results
      .map((model, index) => getResult({ action, model, index, commandName }));
  }

  // Nested results reuse `nestedParentIds` to assign proper `path` index.
  // Also it reuses its order, so sorting is kept
  return nestedParentIds
    .map((ids, index) => {
      const { path } = parentResults[index];
      return getEachResults({ action, ids, commandName, path, results });
    })
    .reduce(assignArray, []);
};

const getEachResults = function ({ ids, results, ...rest }) {
  const multiple = Array.isArray(ids);
  return results
    .filter(({ id }) => (multiple ? ids.includes(id) : ids === id))
    .map((model, index) => getResult({ model, index, multiple, ...rest }));
};

const getResult = function ({
  action: { command, modelName, select },
  model,
  index,
  path = [],
  commandName,
  multiple = command.multiple,
}) {
  const pathA = multiple
    ? [...path, commandName, index]
    : [...path, commandName];
  return { path: pathA, model, modelName, select };
};

module.exports = {
  processResults,
};
