'use strict';

const { applyLogFilter } = require('./log_filter');

const reduceInput = function (requestInfo, logFilter) {
  return reducers.reduce(
    (info, reducer) => reducer(info, logFilter),
    requestInfo,
  );
};

const inputReducer = function (attrName, requestInfo, logFilter) {
  const { [attrName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = applyLogFilter({ logFilter: logFilter[attrName], obj: value });

  return { ...requestInfo, [attrName]: valueA };
};

const reducers = ['queryVars', 'headers', 'params', 'settings']
  .map(attrName => inputReducer.bind(null, attrName));

module.exports = {
  reduceInput,
};
