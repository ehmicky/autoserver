'use strict';

const { identity } = require('../../utilities');

const { applyFilter } = require('./filter');

const reduceAllModels = function (requestInfo, filter) {
  return modelsReducers.reduce(
    (info, reducer) => reducer(info, filter),
    requestInfo,
  );
};

const reducePayload = function (requestInfo, { payload: filter }) {
  return reduceInfo({ info: requestInfo, attrName: 'payload', filter });
};

const reduceData = function (requestInfo, { data: filter }) {
  const args = reduceInfo({ info: requestInfo.args, attrName: 'data', filter });
  return { ...requestInfo, args };
};

const reduceResponse = function (requestInfo, { response: filter }) {
  return reduceInfo({ info: requestInfo, attrName: 'responseData', filter });
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

  return { ...info, ...reducedValue, [`${attrName}Size`]: size };
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
    [`${attrName}Count`]: count,
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
