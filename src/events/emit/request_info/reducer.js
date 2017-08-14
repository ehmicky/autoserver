'use strict';

const { identity } = require('../../../utilities');

const { applyEventFilter } = require('./event_filter');

const reduceInfo = function ({ info, attrName, eventFilter }) {
  if (!info || info[attrName] === undefined) { return info; }
  const value = info[attrName];

  const reducer = getInfoReducer({ value });
  const reducedValue = reducer({ value, attrName, eventFilter });

  const size = getSize({ value });

  return { ...info, ...reducedValue, [`${attrName}Size`]: size };
};

const getInfoReducer = function ({ value }) {
  if (Array.isArray(value)) { return reducerArray; }
  if (isObject(value)) { return reducerObject; }
  if (!value) { return reducerFalsy; }

  return identity;
};

const reducerArray = function ({ value: array, attrName, eventFilter }) {
  const count = array.length;
  const arrayA = array
    .filter(isObject)
    .map(obj => applyEventFilter({ eventFilter, obj }));

  return {
    [`${attrName}Count`]: count,
    [attrName]: arrayA,
  };
};

const reducerObject = function ({ value: obj, attrName, eventFilter }) {
  const objA = applyEventFilter({ eventFilter, obj });
  return { [attrName]: objA };
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
