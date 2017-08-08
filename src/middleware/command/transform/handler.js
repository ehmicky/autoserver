'use strict';

const {
  applyInputTransforms,
  applyOutputTransforms,
} = require('./transformer');

// Handles `attr.transform` and `attr.compute`
const handleTransforms = async function (nextFunc, input) {
  const inputA = applyInputTransforms({ input });

  const response = await nextFunc(inputA);

  const responseA = applyOutputTransforms({ input, response });

  return responseA;
};

module.exports = {
  handleTransforms,
};
