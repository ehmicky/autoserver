'use strict';

const {
  applyInputTransforms,
  applyOutputTransforms,
} = require('./transformer');

// Handles `attr.transform` and `attr.compute`
const handleTransforms = async function (nextFunc, input) {
  const inputA = applyInputTransforms({ input });

  const inputB = await nextFunc(inputA);

  const inputC = applyOutputTransforms({ input: inputB });

  return inputC;
};

module.exports = {
  handleTransforms,
};
