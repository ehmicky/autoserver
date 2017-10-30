'use strict';

const { applyFilter } = require('./filter');

const reduceInput = function (requestInfo, filter) {
  return REQ_NAMES
    .map(opts => inputReducer.bind(null, opts))
    .reduce(
      (info, reducer) => reducer(info, filter),
      requestInfo,
    );
};

const inputReducer = function (
  { attrName, reqName, lowercase },
  requestInfo,
  filter,
) {
  const { [reqName]: value } = requestInfo;
  if (!value || value.constructor !== Object) { return requestInfo; }

  const valueA = applyFilter({
    filter: filter[attrName],
    obj: value,
    lowercase,
  });

  return { ...requestInfo, [reqName]: valueA };
};

const REQ_NAMES = [
  { attrName: 'query', reqName: 'queryVars' },
  { attrName: 'headers', reqName: 'requestHeaders', lowercase: true },
  { attrName: 'headers', reqName: 'responseHeaders', lowercase: true },
];

module.exports = {
  reduceInput,
};
