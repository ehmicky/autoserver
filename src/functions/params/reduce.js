'use strict';

const { get, set, has, pick, omitBy } = require('../../utilities');

// Reduce the size of parameters that might be too big
const reduceParams = function ({ params }) {
  const paramsB = attributes.reduce(
    (paramsA, { path, filter }) =>
      reduceInfo({ params: paramsA, path, filter }),
    params,
  );
  const paramsC = omitBy(paramsB, value => value === undefined);
  return paramsC;
};

const attributes = [
  { path: ['queryvars'], filter: ['operationName'] },
  { path: ['payload'], filter: ['id', 'operationName'] },
  { path: ['args', 'data'], filter: ['id'] },
  { path: ['responsedata'], filter: ['id'] },
];

const reduceInfo = function ({ params, path, filter }) {
  if (!has(params, path)) { return params; }

  const value = get(params, path);
  const valueA = reduceValue({ value, filter });

  const paramsA = set(params, path, valueA);
  return paramsA;
};

const reduceValue = function ({ value, filter }) {
  if (Array.isArray(value)) {
    return value
      .filter(isObject)
      .map(obj => pick(obj, filter));
  }

  if (isObject(value)) {
    return pick(value, filter);
  }

  // Otherwise, removes value altogether
};

const isObject = obj => obj && obj.constructor === Object;

module.exports = {
  reduceParams,
};
