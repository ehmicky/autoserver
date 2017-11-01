'use strict';

const { parallelResolve } = require('./parallel');
const { serialResolve } = require('./serial');

// Add `action.currentData`, i.e. current models for the write actions about
// to be fired.
// Also adds `action.dataPaths` for `patch` and `delete` commands.
const addCurrentData = function (
  { actions, top, top: { command }, ...rest },
  nextLayer,
) {
  const resolver = resolvers[command.type];

  if (resolver === undefined) { return { actions }; }

  return resolver({ actions, top, ...rest }, nextLayer);
};

// `find` and `create` commands do not use `currentData`
// `patch` and `delete` use `args.filter|id` so need to be run serially, waiting
// for their parent.
// But `replace` can be run in parallel.
const resolvers = {
  create: parallelResolve,
  replace: parallelResolve,
  patch: serialResolve,
  delete: serialResolve,
};

module.exports = {
  addCurrentData,
};
