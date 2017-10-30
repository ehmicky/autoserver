'use strict';

const { applyFilter } = require('./filter');

const reduceInput = function (requestInfo, filter) {
  return REQ_NAMES
    .map(([attrName, reqName]) =>
      inputReducer.bind(null, { attrName, reqName }))
    .reduce(
      (info, reducer) => reducer(info, filter),
      requestInfo,
    );
};

const inputReducer = function ({ attrName, reqName }, requestInfo, filter) {
  const { [reqName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = applyFilter({
    filter: filter[attrName],
    obj: value,
  });

  return { ...requestInfo, [reqName]: valueA };
};

const REQ_NAMES = [
  ['query', 'queryVars'],
  ['headers', 'requestHeaders'],
];

module.exports = {
  reduceInput,
};
