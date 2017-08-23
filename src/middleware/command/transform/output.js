'use strict';

const { transformData } = require('./transformer');

// Handles `attr.compute`
const handleComputes = function (input) {
  const { response, response: { data }, idl, modelName, ifv } = input;

  if (!data) { return; }

  const dataA = transformData({ data, idl, modelName, ifv, input, type: 'compute' });

  const responseA = { ...response, data: dataA };
  return { response: responseA };
};

module.exports = {
  handleComputes,
};
