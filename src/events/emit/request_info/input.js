'use strict';

const { applyEventFilter } = require('./event_filter');

const reduceInput = function (requestInfo, eventFilter) {
  return reducers.reduce(
    (info, reducer) => reducer(info, eventFilter),
    requestInfo,
  );
};

const inputReducer = function (attrName, requestInfo, eventFilter) {
  const { [attrName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = applyEventFilter({
    eventFilter: eventFilter[attrName],
    obj: value,
  });

  return { ...requestInfo, [attrName]: valueA };
};

const reducers = ['queryVars', 'headers', 'params', 'settings']
  .map(attrName => inputReducer.bind(null, attrName));

module.exports = {
  reduceInput,
};
