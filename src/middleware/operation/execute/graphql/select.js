'use strict';

const { assignObject, mapValues } = require('../../../../utilities');

const selectFields = function ({ actions }) {
  return actions.map(({ data, actionPath, select }) => {
    const dataA = selectFieldsByAction({ data, select });
    return { data: dataA, actionPath };
  });
};

const selectFieldsByAction = function ({ data, select }) {
  if (Array.isArray(data)) {
    return data.map(datum => selectFieldsByAction({ data: datum, select }));
  }

  // Make sure return value is sorted in the same order as `args.select`
  const fields = select
    .map(({ outputKey, dbKey }) => ({ [outputKey]: data[dbKey] }))
    .reduce(assignObject, {});
  const fieldsA = mapValues(
    fields,
    value => value === undefined ? null : value,
  );
  return fieldsA;
};

module.exports = {
  selectFields,
};
