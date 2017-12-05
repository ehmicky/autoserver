'use strict';

const { identity, pick } = require('../../utilities');

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
  const valueA = reducer({ value, attrName, filter });

  return { ...info, ...valueA };
};

const getInfoReducer = function ({ value }) {
  if (Array.isArray(value)) { return reducerArray; }
  if (isObject(value)) { return reducerObject; }
  if (!value) { return reducerFalsy; }

  return identity;
};

const reducerArray = function ({ value: array, attrName, filter }) {
  const arrayA = array
    .filter(isObject)
    .map(obj => pick(obj, filter));
  return { [attrName]: arrayA };
};

const reducerObject = function ({ value: obj, attrName, filter }) {
  const objA = pick(obj, filter);
  return { [attrName]: objA };
};

const reducerFalsy = function ({ attrName }) {
  return { [attrName]: undefined };
};

const isObject = obj => obj && obj.constructor === Object;

module.exports = {
  reduceAllModels,
};
