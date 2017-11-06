'use strict';

const { identity } = require('../../utilities');

const { applyFilter } = require('./filter');

const reduceAllModels = function (requestinfo, filter) {
  return modelsReducers.reduce(
    (info, reducer) => reducer(info, filter),
    requestinfo,
  );
};

const reducePayload = function (requestinfo, { payload: filter }) {
  return reduceInfo({ info: requestinfo, attrName: 'payload', filter });
};

const reduceData = function (requestinfo, { data: filter }) {
  const args = reduceInfo({ info: requestinfo.args, attrName: 'data', filter });
  return { ...requestinfo, args };
};

const reduceResponse = function (requestinfo, { response: filter }) {
  return reduceInfo({ info: requestinfo, attrName: 'responseData', filter });
};

const modelsReducers = [
  reducePayload,
  reduceData,
  reduceResponse,
];

const reduceInfo = function ({ info, attrName, filter }) {
  if (!info || info[attrName] === undefined) { return info; }
  const value = info[attrName];

  const reducer = getInfoReducer({ value });
  const reducedValue = reducer({ value, attrName, filter });

  const size = getSize({ value });

  return { ...info, ...reducedValue, [`${attrName}size`]: size };
};

const getInfoReducer = function ({ value }) {
  if (Array.isArray(value)) { return reducerArray; }
  if (isObject(value)) { return reducerObject; }
  if (!value) { return reducerFalsy; }

  return identity;
};

const reducerArray = function ({ value: array, attrName, filter }) {
  const count = array.length;
  const arrayA = array
    .filter(isObject)
    .map(obj => applyFilter({ filter, obj }));

  return {
    [`${attrName}count`]: count,
    [attrName]: arrayA,
  };
};

const reducerObject = function ({ value: obj, attrName, filter }) {
  const objA = applyFilter({ filter, obj });
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
  reduceAllModels,
};
