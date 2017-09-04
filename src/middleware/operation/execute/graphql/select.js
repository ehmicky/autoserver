'use strict';

const { assignObject, mapValues } = require('../../../../utilities');

const selectFields = function ({ actions }) {
  return actions.map(selectFieldsByAction);
};

const selectFieldsByAction = function ({ data, actionPath, select }) {
  // Make sure return value is sorted in the same order as `args.select`
  const dataA = select
    .map(({ outputKey, dbKey }) => ({ [outputKey]: data[dbKey] }))
    .reduce(assignObject, {});
  const dataB = mapValues(
    dataA,
    value => value === undefined ? null : value,
  );
  return { data: dataB, actionPath };
};

module.exports = {
  selectFields,
};
