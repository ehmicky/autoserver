'use strict';

const { transformData } = require('./transformer');

// Handles `attr.transform` and `attr.value`
const handleTransforms = function ({
  args,
  args: { newData },
  idl,
  modelName,
  ifv,
}) {
  if (!newData) { return; }

  const newDataA = transformData({
    data: newData,
    idl,
    modelName,
    ifv,
    type: 'transform',
  });
  const newDataB = transformData({
    data: newDataA,
    idl,
    modelName,
    ifv,
    type: 'value',
  });

  return { args: { ...args, newData: newDataB } };
};

module.exports = {
  handleTransforms,
};
