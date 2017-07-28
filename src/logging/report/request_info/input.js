'use strict';

const reduceInput = function (requestInfo, loggerFilter) {
  return reducers.reduce(
    (info, reducer) => reducer(info, loggerFilter),
    requestInfo,
  );
};

const inputReducer = function (attrName, requestInfo, loggerFilter) {
  const { [attrName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = loggerFilter[attrName](value);

  return { ...requestInfo, [attrName]: valueA };
};

const reducers = ['queryVars', 'headers', 'params', 'settings']
  .map(attrName => inputReducer.bind(null, attrName));

module.exports = {
  reduceInput,
};
