'use strict';

const { identity, pick } = require('../../utilities');
const { addErrorHandler } = require('../../error');

const reduceAllModels = function (requestinfo) {
  return modelsReducers.reduce((info, reducer) => reducer(info), requestinfo);
};

const reducePayload = function (requestinfo) {
  return reduceInfo({
    info: requestinfo,
    attrName: 'payload',
    filter: ['id', 'operationName'],
  });
};

const reduceData = function (requestinfo) {
  const args = reduceInfo({
    info: requestinfo.args,
    attrName: 'data',
    filter: 'id',
  });
  return { ...requestinfo, args };
};

const reduceResponse = function (requestinfo) {
  return reduceInfo({
    info: requestinfo,
    attrName: 'responsedata',
    filter: 'id',
  });
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

  const size = eGetSize({ value });

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
    .map(obj => pick(obj, filter));

  return {
    [`${attrName}count`]: count,
    [attrName]: arrayA,
  };
};

const reducerObject = function ({ value: obj, attrName, filter }) {
  const objA = pick(obj, filter);
  return { [attrName]: objA };
};

const reducerFalsy = function ({ attrName }) {
  return { [attrName]: undefined };
};

const isObject = obj => obj && obj.constructor === Object;

const getSize = function ({ value }) {
  return JSON.stringify(value).length;
};

// Returns `size` `undefined` if not JSON
const eGetSize = addErrorHandler(getSize);

module.exports = {
  reduceAllModels,
};
