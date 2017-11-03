'use strict';

const { mapValues } = require('../../utilities');
const { runSchemaFunc } = require('../../schema_func');

// Handles `attr.value`
const handleTransforms = function ({
  args,
  args: { newData, currentData },
  modelName,
  schema: { shortcuts: { valuesMap } },
  mInput,
}) {
  if (newData === undefined) { return; }

  const values = valuesMap[modelName];

  const newDataA = newData.map((newDatum, index) => transformDatum({
    newDatum,
    currentDatum: currentData[index],
    values,
    mInput,
  }));

  return { args: { ...args, newData: newDataA } };
};

const transformDatum = function ({ newDatum, currentDatum, values, mInput }) {
  const newDatumA = mapValues(
    values,
    (value, attrName) => transformAttr({
      newDatum,
      currentDatum,
      attrName,
      value,
      mInput,
    }),
  );
  return { ...newDatum, ...newDatumA };
};

const transformAttr = function ({
  newDatum,
  currentDatum,
  attrName,
  value,
  mInput,
}) {
  const oldVal = currentDatum == null ? undefined : currentDatum[attrName];
  const vars = {
    $model: newDatum,
    $val: newDatum[attrName],
    $oldModel: currentDatum,
    $oldVal: oldVal,
  };
  const valueA = runSchemaFunc({ schemaFunc: value, mInput, vars });

  return valueA;
};

module.exports = {
  handleTransforms,
};
