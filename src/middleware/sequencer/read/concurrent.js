'use strict';

const { difference } = require('../../../utilities');
const { extractSimpleIds, getSimpleFilter } = require('../../../filter');

// If another `find` command searching for the same models is currently running,
// use its future results (for efficiency reasons) instead of running it.
// The concurrent command might be ongoing or have already completed.
// This also allow us to reuse the results of previous commands, both read and
// write, which is useful for:
//  - efficiency
//  - output consistency, i.e. each model has a single representation for a
//    given request
const getConcurrentCommand = function ({ args, results, collname }) {
  const ids = extractSimpleIds(args) || [];
  const concurrentResults = getConcurrentResults({ ids, results, collname });

  // No concurrent `find` commands can be used
  if (concurrentResults.length === 0) {
    return { args, concurrentPromises: [] };
  }

  const argsA = removeConcurrentIds({ concurrentResults, ids, args });

  // Models searched by concurrent command, either ongoing (promises) or
  // already fetched (models as is)
  const concurrentPromises = concurrentResults
    .map(({ promise, model, metadata }) => promise || { model, metadata });

  return { concurrentPromises, args: argsA };
};

// Looks for concurrent `find` commands searching for the same models
const getConcurrentResults = function ({ ids, results, collname }) {
  return ids
    .map(id => getConcurrentResult({ id, results, collname }))
    .filter(result => result !== undefined);
};

const getConcurrentResult = function ({ id, results, collname }) {
  return results
    .find(result => result.model.id === id && result.collname === collname);
};

// Do not try to search for models while waiting for another command to
// fetch them, i.e. remove them from `args.filter.id`
const removeConcurrentIds = function ({ concurrentResults, ids, args }) {
  const concurrentIds = concurrentResults.map(({ model: { id } }) => id);
  const idsA = difference(ids, concurrentIds);

  const filter = getSimpleFilter({ ids: idsA });
  return { ...args, filter };
};

// Communicate to parallel commands which `id`s are currently being searched
// so that each call can reuse the result from other calls when targetting
// the same model.
const getPendingResults = function ({ args, results, collname, promise }) {
  const ids = extractSimpleIds(args) || [];
  const pendingResults = ids.map(id => ({ model: { id }, collname, promise }));

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
