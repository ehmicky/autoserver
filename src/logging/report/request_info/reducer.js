'use strict';

const { identity } = require('../../../utilities');

const reduceInfo = function ({ info, attrName, filter }) {
  if (!info || info[attrName] === undefined) { return info; }
  const value = info[attrName];

  const reducer = getInfoReducer({ value });
  const reducedValue = reducer({ value, attrName, filter });

  const size = getSize({ value });

  return { ...info, ...reducedValue, [`${attrName}Size`]: size };
};

const getInfoReducer = function ({ value }) {
  if (Array.isArray(value)) { return reducerArray; }
  if (isObject(value)) { return reducerObject; }
  if (!value) { return reducerFalsy; }

  return identity;
};

const reducerArray = function ({ value, attrName, filter }) {
  const count = value.length;
  const valueA = value
    .filter(isObject)
    .map(obj => filter(obj));

  return {
    [`${attrName}Count`]: count,
    [attrName]: valueA,
  };
};

const reducerObject = function ({ value, attrName, filter }) {
  const valueA = filter(value);
  return { [attrName]: valueA };
};

const reducerFalsy = function ({ attrName }) {
  return { [attrName]: undefined };
};

const isObject = obj => obj && obj.constructor === Object;

const getSize = function ({ value }) {
  try {
    return JSON.stringify(value).length;
  } catch (error) {
    return 'unknown';
  }
};

module.exports = {
  reduceInfo,
};
