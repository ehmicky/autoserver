'use strict';

const { parallelResolve } = require('./parallel');
const { serialResolve } = require('./serial');

const addCurrentData = async function (
  {
    actions,
    top,
    top: { actionConstant: { type: actionType } },
    ...rest
  },
  nextLayer,
) {
  const resolver = resolvers[actionType];

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
