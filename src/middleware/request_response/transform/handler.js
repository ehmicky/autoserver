'use strict';

const { transformData } = require('./transformer');

// Handles `attr.value`
const handleTransforms = function ({
  args,
  args: { newData },
  schema,
  modelName,
  mInput,
}) {
  if (!newData) { return; }

  const newDataA = transformData({ data: newData, schema, modelName, mInput });

  return { args: { ...args, newData: newDataA } };
};

module.exports = {
  handleTransforms,
};
