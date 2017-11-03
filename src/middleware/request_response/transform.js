'use strict';

const { mapValues, omitBy } = require('../../utilities');
const { runSchemaFunc } = require('../../schema_func');

// Handles `attr.value` and `attr.readonly`
const handleTransforms = function (type, {
  args,
  args: { newData, currentData },
  modelName,
  schema: { shortcuts },
  mInput,
}) {
  if (newData === undefined) { return; }

  const { mapName } = handlers[type];
  const transformVals = shortcuts[mapName][modelName];

  const newDataA = newData.map((newDatum, index) => transformDatum({
    type,
    newDatum,
    currentDatum: currentData[index],
    transformVals,
    mInput,
  }));

  return { args: { ...args, newData: newDataA } };
};

const transformDatum = function ({
  type,
  newDatum,
  currentDatum,
  transformVals,
  mInput,
}) {
  const newDatumA = mapValues(
    transformVals,
    (transformVal, attrName) => transformAttr({
      type,
      newDatum,
      currentDatum,
      attrName,
      transformVal,
      mInput,
    }),
  );

  // Make sure we keep null as undefined
  const newDatumB = omitBy(newDatumA, newVal => newVal == null);

  const newDatumC = { ...newDatum, ...newDatumB };
  return newDatumC;
};

const transformAttr = function ({
  type,
  newDatum,
  currentDatum,
  attrName,
  transformVal,
  mInput,
}) {
  const newVal = newDatum[attrName];
  const oldVal = currentDatum == null ? undefined : currentDatum[attrName];
  const vars = {
    $model: newDatum,
    $val: newVal,
    $oldModel: currentDatum,
    $oldVal: oldVal,
  };
  const transformValA = runSchemaFunc({
    schemaFunc: transformVal,
    mInput,
    vars,
  });

  const { setAttr } = handlers[type];
  const newValA = setAttr({ transformVal: transformValA, oldVal, newVal });

  return newValA;
};

const valueSetAttr = function ({ transformVal }) {
  return transformVal;
};

const readonlySetAttr = function ({ transformVal, oldVal, newVal }) {
  if (!transformVal) { return newVal; }

  return oldVal;
};

const handlers = {
  value: { setAttr: valueSetAttr, mapName: 'valuesMap' },
  readonly: { setAttr: readonlySetAttr, mapName: 'readonlyMap' },
};

const handleValue = handleTransforms.bind(null, 'value');
// Sets attributes marked in schema as `readonly` to their current value
// (i.e. `currentData`)
// This is done silently (i.e. does not raise warnings or errors),
// because readonly attributes can be part of a normal response, and clients
// should be able to send responses back as is without having to remove
// readonly attributes, even if another user changes that same model.
const handleReadonly = handleTransforms.bind(null, 'readonly');

module.exports = {
  handleValue,
  handleReadonly,
};
