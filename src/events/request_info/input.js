'use strict';

const { applyFilter } = require('./filter');

const reduceInput = function (requestInfo, filter) {
  return reducers.reduce(
    (info, reducer) => reducer(info, filter),
    requestInfo,
  );
};

const inputReducer = function (attrName, requestInfo, filter) {
  const reqName = reqNames[attrName];
  const { [reqName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = applyFilter({
    filter: filter[attrName],
    obj: value,
  });

  return { ...requestInfo, [reqName]: valueA };
};

const reqNames = {
  query: 'queryVars',
  headers: 'headers',
};

const reducers = ['query', 'headers']
  .map(attrName => inputReducer.bind(null, attrName));

module.exports = {
  reduceInput,
};
