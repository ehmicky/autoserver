'use strict';

const { applyFilter } = require('./filter');

const reduceInput = function (requestInfo, filter) {
  return reducers.reduce(
    (info, reducer) => reducer(info, filter),
    requestInfo,
  );
};

const inputReducer = function (attrName, requestInfo, filter) {
  const { [attrName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = applyFilter({
    filter: filter[attrName],
    obj: value,
  });

  return { ...requestInfo, [attrName]: valueA };
};

const reducers = ['queryVars', 'headers']
  .map(attrName => inputReducer.bind(null, attrName));

module.exports = {
  reduceInput,
};
