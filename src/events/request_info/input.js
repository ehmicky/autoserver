'use strict';

const { pick } = require('../../utilities');

const reduceInput = function (requestinfo, filter) {
  return REQ_NAMES
    .map(opts => inputReducer.bind(null, opts))
    .reduce((info, reducer) => reducer(info, filter), requestinfo);
};

const inputReducer = function ({ reqName, filter }, requestinfo) {
  const { [reqName]: value } = requestinfo;
  if (!value || value.constructor !== Object) { return requestinfo; }

  const valueA = pick(value, filter);

  return { ...requestinfo, [reqName]: valueA };
};

const REQ_NAMES = [
  { reqName: 'queryvars', filter: 'operationName' },
];

module.exports = {
  reduceInput,
};
