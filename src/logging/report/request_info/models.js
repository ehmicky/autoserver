'use strict';

const { reduceActions } = require('./actions');
const { reduceInfo } = require('./reducer');

const reduceAllModels = function (requestInfo, logFilter) {
  return modelsReducers.reduce(
    (info, reducer) => reducer(info, logFilter),
    requestInfo,
  );
};

const reducePayload = function (requestInfo, { payload: logFilter }) {
  return reduceInfo({ info: requestInfo, attrName: 'payload', logFilter });
};

const reduceResponse = function (requestInfo, { response: logFilter }) {
  return reduceInfo({ info: requestInfo, attrName: 'response', logFilter });
};

const modelsReducers = [
  reducePayload,
  reduceActions,
  reduceResponse,
];

module.exports = {
  reduceAllModels,
};
