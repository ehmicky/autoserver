'use strict';

const { transformData } = require('./transformer');

// Handles `attr.transform` and `attr.value`
const handleTransforms = function (input) {
  const { args, args: { newData }, idl, modelName } = input;

  if (!newData) { return; }

  const newDataA = transformData({
    data: newData,
    idl,
    modelName,
    input,
    type: 'transform',
  });
  const newDataB = transformData({
    data: newDataA,
    idl,
    modelName,
    input,
    type: 'value',
  });

  return { args: { ...args, newData: newDataB } };
};

module.exports = {
  handleTransforms,
};
