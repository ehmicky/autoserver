'use strict';

const { reduceActions } = require('./actions');
const { reduceInfo } = require('./reducer');

const reduceAllModels = function (requestInfo, loggerFilter) {
  return modelsReducers.reduce(
    (info, reducer) => reducer(info, loggerFilter),
    requestInfo,
  );
};

const reducePayload = function (requestInfo, { payload: filter }) {
  return reduceInfo({ info: requestInfo, attrName: 'payload', filter });
};

const reduceResponse = function (requestInfo, loggerFilter) {
  return reduceInfo({
    info: requestInfo,
    attrName: 'response',
    filter: loggerFilter.response,
  });
};

const modelsReducers = [
  reducePayload,
  reduceActions,
  reduceResponse,
];

module.exports = {
  reduceAllModels,
};
