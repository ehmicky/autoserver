'use strict';

const { transformData } = require('./transformer');

// Handles `attr.compute`
const handleComputes = async function (nextFunc, input) {
  const inputA = await nextFunc(input);

  const inputB = applyOutputTransforms({ input: inputA });
  return inputB;
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
