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
  const transforms = shortcuts[mapName][modelName];

  const newDataA = newData.map((newDatum, index) => transformDatum({
    type,
    newDatum,
    currentDatum: currentData[index],
    transforms,
    mInput,
  }));

  return { args: { ...args, newData: newDataA } };
};

const transformDatum = function ({
  type,
  newDatum,
  currentDatum,
  transforms,
  mInput,
}) {
  const transformsA = filterTransforms({
    type,
    transforms,
    currentDatum,
    newDatum,
  });

  const newDatumA = mapValues(
    transformsA,
    (transform, attrName) => transformAttr({
      type,
      newDatum,
      currentDatum,
      attrName,
      transform,
      mInput,
    }),
  );

  const newDatumB = { ...newDatum, ...newDatumA };

  return newDatumB;
};

const filterTransforms = function ({
  type,
  transforms,
  currentDatum,
  newDatum,
}) {
  const { condition } = handlers[type];
  if (condition === undefined) { return transforms; }

  const transformsA = pickBy(
    transforms,
    (transform, attrName) => filterTransform({
      condition,
      newDatum,
      currentDatum,
      attrName,
    }),
  );
  return transformsA;
};

const filterTransform = function ({
  condition,
  newDatum,
  currentDatum,
  attrName,
}) {
  const vars = getModelVars({ newDatum, currentDatum, attrName });
  return condition(vars);
};

const transformAttr = function ({
  type,
  newDatum,
  currentDatum,
  attrName,
  transform,
  mInput,
}) {
  const vars = getModelVars({ newDatum, currentDatum, attrName });

  const transformA = runSchemaFunc({ schemaFunc: transform, mInput, vars });

  const { setAttr } = handlers[type];
  const newValA = setAttr({ transform: transformA, ...vars });

  // Normalize `null` to `undefined`
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

// Apply `attr.default` only on model creation (on `create` or `upsert`),
// and the attribute is missing
const shouldSetDefault = function ({ currentDatum, newVal }) {
  return currentDatum === undefined && newVal == null;
};

const setTransform = function ({ transform }) {
  return transform;
};

const setCurrentValIfTrue = function ({ transform, $oldVal, $val }) {
  if (!transform) { return $val; }

  return $oldVal;
};

const handlers = {
  value: {
    mapName: 'valuesMap',
    setAttr: setTransform,
  },
  default: {
    mapName: 'userDefaultsMap',
    condition: shouldSetDefault,
    setAttr: setTransform,
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
