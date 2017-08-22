'use strict';

const { transformData } = require('./transformer');

// Handles `attr.compute`
const handleComputes = function (input) {
  const inputA = applyOutputTransforms({ input });
  return inputA;
};

const applyOutputTransforms = function ({
  input,
  input: { response, response: { data } },
}) {
  if (!data) { return response; }

  const dataA = transformData({ data, input, type: 'compute' });

  const responseA = { ...response, data: dataA };
  return { ...input, response: responseA };
};

module.exports = {
  handleComputes,
};
