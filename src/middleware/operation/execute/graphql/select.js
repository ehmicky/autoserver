'use strict';

const { mapValues, assignObject, get, set } = require('../../../../utilities');

// Only output the fields that were picked by the client
// Also rename fields if the output key is different from the database one,
// e.g. using GraphQL "aliases"
const selectFields = function ({ responseData, actions }) {
  return actions.reduceRight(selectFieldsByAction, responseData);
};

const selectFieldsByAction = function (responseData, { actionPath, select }) {
  const data = get(responseData, actionPath);

  if (data == null) { return responseData; }

  // Make sure return value is sorted in the same order as `select`
  const dataA = select
    .map(({ dbKey, outputKey }) => ({ [outputKey]: data[dbKey] }))
    .reduce(assignObject, {});
  const dataB = mapValues(dataA, normalizeNull);

  const responseDataA = set(responseData, actionPath, dataB);
  return responseDataA;
};

// Transform `undefined` to `null`
const normalizeNull = function (value) {
  if (value !== undefined) { return value; }

  return null;
};

module.exports = {
  selectFields,
};
