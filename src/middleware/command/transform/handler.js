'use strict';

const {
  applyInputTransforms,
  applyOutputTransforms,
} = require('./transformer');

// Handles `attr.transform` and `attr.compute`
const handleTransforms = async function (nextFunc, input) {
  const inputA = applyInputTransforms({ input, type: 'transform' });

  const response = await nextFunc(inputA);

  const responseA = applyOutputTransforms({ input, response, type: 'compute' });

  return responseA;
};

module.exports = {
  handleTransforms,
};
