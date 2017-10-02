'use strict';

const { parallelResolve } = require('./parallel');
const { serialResolve } = require('./serial');

// Add `action.currentData`, i.e. current models for the write actions about
// to be fired.
// Also adds `action.dataPaths` for `patch` and `delete` commands.
const addCurrentData = async function (
  {
    actions,
    top,
    top: { command: { type: commandType } },
    ...rest
  },
  nextLayer,
) {
  const resolver = resolvers[commandType];

  if (resolver === undefined) { return { actions }; }

  const actionsA = await resolver({ actions, top, ...rest }, nextLayer);
  return { actions: actionsA };
};

// `find` and `create` commands do not use `currentData`
// `patch` and `delete` use `args.filter` so need to be run serially, waiting
// for their parent.
// But `replace` can be run in parallel.
const resolvers = {
  replace: parallelResolve,
  patch: serialResolve,
  delete: serialResolve,
};

module.exports = {
  addCurrentData,
};
