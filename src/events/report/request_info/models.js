'use strict';

const { reduceActions } = require('./actions');
const { reduceInfo } = require('./reducer');

const reduceAllModels = function (requestInfo, eventFilter) {
  return modelsReducers.reduce(
    (info, reducer) => reducer(info, eventFilter),
    requestInfo,
  );
};

const reducePayload = function (requestInfo, { payload: eventFilter }) {
  return reduceInfo({ info: requestInfo, attrName: 'payload', eventFilter });
};

const reduceResponse = function (requestInfo, { response: eventFilter }) {
  return reduceInfo({ info: requestInfo, attrName: 'response', eventFilter });
};

const modelsReducers = [
  reducePayload,
  reduceActions,
  reduceResponse,
];

module.exports = {
  reduceAllModels,
};
