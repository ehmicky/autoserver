'use strict';

const { transformData } = require('./transformer');

// Handles `attr.transform` and `attr.value`
const handleTransforms = function ({
  args,
  args: { newData },
  schema,
  modelName,
  mInput,
}) {
  if (!newData) { return; }

  const newDataA = transformData({
    data: newData,
    schema,
    modelName,
    mInput,
    type: 'transform',
  });
  const newDataB = transformData({
    data: newDataA,
    schema,
    modelName,
    mInput,
    type: 'value',
  });

  return { args: { ...args, newData: newDataB } };
};

module.exports = {
  handleTransforms,
};
