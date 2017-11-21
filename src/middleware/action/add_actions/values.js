'use strict';

const { flatten } = require('../../../utilities');

const getValues = function ({ actions, filter, mapper, ...rest }) {
  const values = actions
    .filter(({ args }) => filterArgs({ args, filter }))
    .map(action => mapper({ action, ...rest }));
  const valuesA = flatten(values);
  return valuesA;
};

const filterArgs = function ({ args, filter }) {
  return filter.some(key => args[key] !== undefined);
};

module.exports = {
  getValues,
};
