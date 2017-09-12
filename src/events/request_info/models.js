'use strict';

const { identity } = require('../../utilities');

const { applyEventFilter } = require('./event_filter');

const reduceAllModels = function (requestInfo, eventFilter) {
  return modelsReducers.reduce(
    (info, reducer) => reducer(info, eventFilter),
    requestInfo,
  );
};

const reducePayload = function (requestInfo, { payload: eventFilter }) {
  return reduceInfo({ info: requestInfo, attrName: 'payload', eventFilter });
};

const reduceArgsData = function (requestInfo, { argsData: eventFilter }) {
  const args = reduceInfo({
    info: requestInfo.args,
    attrName: 'data',
    eventFilter,
  });
  return { ...requestInfo, args };
};

const reduceResponse = function (requestInfo, { response: eventFilter }) {
  return reduceInfo({ info: requestInfo, attrName: 'response', eventFilter });
};

const modelsReducers = [
  reducePayload,
  reduceArgsData,
  reduceResponse,
];

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
  reduceAllModels,
};
