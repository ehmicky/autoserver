'use strict';

const { applyFilter } = require('./filter');

const reduceInput = function (requestinfo, filter) {
  return REQ_NAMES
    .map(opts => inputReducer.bind(null, opts))
    .reduce(
      (info, reducer) => reducer(info, filter),
      requestinfo,
    );
};

const inputReducer = function (
  { attrName, reqName, lowercase },
  requestinfo,
  filter,
) {
  const { [reqName]: value } = requestinfo;
  if (!value || value.constructor !== Object) { return requestinfo; }

  const valueA = applyFilter({
    filter: filter[attrName],
    obj: value,
    lowercase,
  });

  return { ...requestinfo, [reqName]: valueA };
};

const REQ_NAMES = [
  { attrName: 'query', reqName: 'queryvars' },
  { attrName: 'headers', reqName: 'requestheaders', lowercase: true },
  { attrName: 'headers', reqName: 'responseHeaders', lowercase: true },
];

module.exports = {
  reduceInput,
};
