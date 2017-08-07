'use strict';

const { makeImmutable } = require('../../../utilities');

const reduceInput = function (requestInfo, logFilter) {
  return reducers.reduce(
    (info, reducer) => reducer(info, logFilter),
    requestInfo,
  );
};

const inputReducer = function (attrName, requestInfo, logFilter) {
  const { [attrName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = makeImmutable(value);
  const valueB = logFilter[attrName](valueA);

  return { ...requestInfo, [attrName]: valueB };
};

const reducers = ['queryVars', 'headers', 'params', 'settings']
  .map(attrName => inputReducer.bind(null, attrName));

module.exports = {
  reduceInput,
};
