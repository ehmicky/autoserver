'use strict';

const { parallelResolve } = require('./parallel');
const { serialResolve } = require('./serial');

const addCurrentData = function ({
  actions,
  top,
  top: { actionConstant: { type: actionType } },
  nextLayer,
  otherLayer,
  mInput,
}) {
  const resolver = resolvers[actionType];

  if (resolver === undefined) { return actions; }

  return resolver({ actions, top, nextLayer, otherLayer, mInput });
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
