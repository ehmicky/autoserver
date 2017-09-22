'use strict';

const { getTopLevelAction } = require('../utilities');

const { parallelResolve } = require('./parallel');
const { serialResolve } = require('./serial');

const addCurrentData = function ({ actions, nextLayer, otherLayer, mInput }) {
  const {
    actionConstant: { type: actionType },
  } = getTopLevelAction({ actions });
  const resolver = resolvers[actionType];

  if (resolver === undefined) { return actions; }

  return resolver({ actions, nextLayer, otherLayer, mInput });
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
