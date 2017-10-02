'use strict';

const { parallelResolve } = require('./parallel');
const { serialResolve } = require('./serial');

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

const resolvers = {
  replace: parallelResolve,
  patch: serialResolve,
  delete: serialResolve,
};

module.exports = {
  addCurrentData,
};
