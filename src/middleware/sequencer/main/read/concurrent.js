'use strict';

const { extractSimpleIds } = require('../../../../database');
const { getSimpleFilter } = require('../../../action');

// If another `find` command searching for the same models is currently running,
// use its future results (for efficiency reasons) instead of running it.
// The concurrent command might be ongoing or have already completed.
// This also allow us to reuse the results of previous commands, both read and
// write, which is useful for:
//  - efficiency
//  - output consistency, i.e. each model has a single representation for a
//    given request
const getConcurrentCommand = function ({ args, results, modelName }) {
  const ids = extractSimpleIds(args) || [];
  const concurrentResults = getConcurrentResults({ ids, results, modelName });

  // No concurrent `find` commands can be used
  if (concurrentResults.length === 0) {
    return { args, concurrentPromises: [] };
  }

  const argsA = removeConcurrentIds({ concurrentResults, ids, args });

  // Models searched by concurrent command, either ongoing (promises) or
  // already fetched (models as is)
  const concurrentPromises = concurrentResults
    .map(({ promise, model }) => promise || model);

  return { concurrentPromises, args: argsA };
};

// Looks for concurrent `find` commands searching for the same models
const getConcurrentResults = function ({ ids, results, modelName }) {
  return ids
    .map(id => getConcurrentResult({ id, results, modelName }))
    .filter(result => result !== undefined);
};

const getConcurrentResult = function ({ id, results, modelName }) {
  return results
    .find(result => result.model.id === id && result.modelName === modelName);
};

// Do not try to search for models while waiting for another command to
// fetch them, i.e. remove them from `args.filter.id`
const removeConcurrentIds = function ({ concurrentResults, ids, args }) {
  const concurrentIds = concurrentResults.map(({ model: { id } }) => id);
  const idsA = ids.filter(id => !concurrentIds.includes(id));

  const filter = getSimpleFilter({ ids: idsA });
  return { ...args, filter };
};

// Communicate to parallel commands which `id`s are currently being searched
// so that each call can reuse the result from other calls when targetting
// the same model.
const getPendingResults = function ({ args, results, modelName, promise }) {
  const ids = extractSimpleIds(args) || [];
  const pendingResults = ids.map(id => ({ model: { id }, modelName, promise }));

  // Since we are sharing between parallel calls, `results` must be a mutable
  // variable.
  // eslint-disable-next-line fp/no-mutating-methods
  results.push(...pendingResults);

  return pendingResults;
};

module.exports = {
  getConcurrentCommand,
  getPendingResults,
};
