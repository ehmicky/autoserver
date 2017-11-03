'use strict';

const { mapValues, pickBy } = require('../../../utilities');
const { runSchemaFunc } = require('../../../schema_func');

// Handles `attr.value`, `attr.default` and `attr.readonly`
const handleTransforms = function (
  handler,
  {
    args,
    args: { newData, currentData },
    modelName,
    schema: { shortcuts },
    mInput,
  },
) {
  if (newData === undefined) { return; }

  const { mapName } = handler;
  const transforms = shortcuts[mapName][modelName];

  const newDataA = newData.map((newDatum, index) => transformDatum({
    handler,
    newDatum,
    currentDatum: currentData[index],
    transforms,
    mInput,
  }));

  return { args: { ...args, newData: newDataA } };
};

const transformDatum = function ({ newDatum, transforms, ...rest }) {
  const transformsA = filterTransforms({ newDatum, transforms, ...rest });

  const newDatumA = mapValues(
    transformsA,
    (transform, attrName) =>
      transformAttr({ newDatum, attrName, transform, ...rest }),
  );

  const newDatumB = { ...newDatum, ...newDatumA };

  return newDatumB;
};

const filterTransforms = function ({
  handler: { condition },
  transforms,
  ...rest
}) {
  if (condition === undefined) { return transforms; }

  const transformsA = pickBy(
    transforms,
    (transform, attrName) => filterTransform({ condition, attrName, ...rest }),
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
  handler: { setAttr },
  newDatum,
  currentDatum,
  attrName,
  transform,
  mInput,
}) {
  const vars = getModelVars({ newDatum, currentDatum, attrName });

  const transformA = runSchemaFunc({ schemaFunc: transform, mInput, vars });

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

module.exports = {
  handleTransforms,
};
