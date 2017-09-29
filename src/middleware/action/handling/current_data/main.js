'use strict';

const { parallelResolve } = require('./parallel');
const { serialResolve } = require('./serial');

const addCurrentData = function (
  {
    actions,
    top,
    top: { actionConstant: { type: actionType } },
    ...rest
  },
  nextLayer,
) {
  const resolver = resolvers[actionType];

  if (resolver === undefined) { return actions; }

  return resolver({ actions, top, ...rest }, nextLayer);
};

const resolvers = {
  replace: parallelResolve,
  upsert: parallelResolve,
  update: serialResolve,
  delete: serialResolve,
};

module.exports = {
  addCurrentData,
};
