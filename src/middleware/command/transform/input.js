'use strict';

const { transformData } = require('./transformer');

// Handles `attr.transform` and `attr.value`
const handleTransforms = function (nextFunc, input) {
  const inputA = applyInputTransforms({ input });

  return nextFunc(inputA);
};

const applyInputTransforms = function ({
  input,
  input: { args, args: { newData } },
}) {
  if (!newData) { return input; }

  const newDataA = transformData({ data: newData, input, type: 'transform' });
  const newDataB = transformData({ data: newDataA, input, type: 'value' });

  return { ...input, args: { ...args, newData: newDataB } };
};

module.exports = {
  handleTransforms,
};
