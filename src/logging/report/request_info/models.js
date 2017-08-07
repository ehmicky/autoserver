'use strict';

const { reduceActions } = require('./actions');
const { reduceInfo } = require('./reducer');

const reduceAllModels = function (requestInfo, logFilter) {
  return modelsReducers.reduce(
    (info, reducer) => reducer(info, logFilter),
    requestInfo,
  );
};

const reducePayload = function (requestInfo, { payload: filter }) {
  return reduceInfo({ info: requestInfo, attrName: 'payload', filter });
};

const reduceResponse = function (requestInfo, logFilter) {
  return reduceInfo({
    info: requestInfo,
    attrName: 'response',
    filter: logFilter.response,
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
