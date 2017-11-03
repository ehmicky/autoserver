'use strict';

const { mapValues, pickBy } = require('../../utilities');
const { runSchemaFunc } = require('../../schema_func');

// Handles `attr.value`, `attr.default` and `attr.readonly`
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
  const transformValsA = filterTransformVals({
    type,
    transformVals,
    currentDatum,
    newDatum,
  });
  const newDatumA = mapValues(
    transformValsA,
    (transformVal, attrName) => transformAttr({
      type,
      newDatum,
      currentDatum,
      attrName,
      transformVal,
      mInput,
    }),
  );

  const newDatumB = { ...newDatum, ...newDatumA };

  return newDatumB;
};

const filterTransformVals = function ({
  type,
  transformVals,
  currentDatum,
  newDatum,
}) {
  const { condition } = handlers[type];
  if (condition === undefined) { return transformVals; }

  const transformValsA = pickBy(
    transformVals,
    (transformVal, attrName) => filterTransformVal({
      condition,
      newDatum,
      currentDatum,
      attrName,
    }),
  );
  return transformValsA;
};

const filterTransformVal = function ({
  condition,
  newDatum,
  currentDatum,
  attrName,
}) {
  const vars = getModelVars({ newDatum, currentDatum, attrName });
  return condition(vars);
};

// Apply `attr.default` only on model creation, and if the attribute value
// is undefined
const shouldSetDefault = function ({ currentDatum, newVal }) {
  return currentDatum === undefined && newVal == null;
};

const transformAttr = function ({
  type,
  newDatum,
  currentDatum,
  attrName,
  transformVal,
  mInput,
}) {
  const vars = getModelVars({ newDatum, currentDatum, attrName });

  const transformValA = runSchemaFunc({
    schemaFunc: transformVal,
    mInput,
    vars,
  });

  const { setAttr } = handlers[type];
  const newValA = setAttr({ transformVal: transformValA, ...vars });

  const newValB = newValA === null ? undefined : newValA;

  return newValB;
};

const getModelVars = function ({ newDatum, currentDatum, attrName }) {
  const newVal = newDatum[attrName];
  const currentVal = currentDatum == null ? undefined : currentDatum[attrName];

  return {
    $model: newDatum,
    $val: newVal,
    $oldModel: currentDatum,
    $oldVal: currentVal,
  };
};

const setTransformVal = function ({ transformVal }) {
  return transformVal;
};

const setCurrentValIfTrue = function ({ transformVal, $oldVal, $val }) {
  if (!transformVal) { return $val; }

  return $oldVal;
};

const handlers = {
  value: {
    mapName: 'valuesMap',
    setAttr: setTransformVal,
  },
  default: {
    mapName: 'userDefaultsMap',
    condition: shouldSetDefault,
    setAttr: setTransformVal,
  },
  readonly: {
    mapName: 'readonlyMap',
    setAttr: setCurrentValIfTrue,
  },
};

// `attr.value`
const handleValue = handleTransforms.bind(null, 'value');
// `attr.default`
const handleUserDefault = handleTransforms.bind(null, 'default');
// `attr.readonly`
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
  handleUserDefault,
};
