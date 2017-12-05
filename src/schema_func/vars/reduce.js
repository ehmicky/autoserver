'use strict';

const { get, set, has, pick } = require('../../utilities');

// Reduce the size of schema variables that might be too big
const reduceVars = function ({ vars }) {
  return attributes.reduce(
    (varsA, { path, filter }) => reduceInfo({ vars: varsA, path, filter }),
    vars,
  );
};

const attributes = [
  { path: ['queryvars'], filter: ['operationName'] },
  { path: ['payload'], filter: ['id', 'operationName'] },
  { path: ['args', 'data'], filter: ['id'] },
  { path: ['responsedata'], filter: ['id'] },
];

const reduceInfo = function ({ vars, path, filter }) {
  if (!has(vars, path)) { return vars; }

  const value = get(vars, path);
  const valueA = reduceValue({ value, filter });

  const varsA = set(vars, path, valueA);
  return varsA;
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

  if (!value) { return; }

  return value;
};

const isObject = obj => obj && obj.constructor === Object;

module.exports = {
  reduceVars,
};
