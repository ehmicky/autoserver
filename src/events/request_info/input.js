'use strict';

const { applyFilter } = require('./filter');

const reduceInput = function (requestInfo, filter) {
  return ATTR_NAMES
    .map(attrName => inputReducer.bind(null, attrName))
    .reduce(
      (info, reducer) => reducer(info, filter),
      requestInfo,
    );
};

const ATTR_NAMES = ['query', 'headers'];

const inputReducer = function (attrName, requestInfo, filter) {
  const reqName = REQ_NAMES[attrName];
  const { [reqName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = applyFilter({
    filter: filter[attrName],
    obj: value,
  });

  return { ...requestInfo, [reqName]: valueA };
};

const REQ_NAMES = {
  query: 'queryVars',
  headers: 'headers',
};

module.exports = {
  reduceInput,
};
