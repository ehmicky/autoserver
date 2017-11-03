'use strict';

const { mapValues, pickBy } = require('../../../utilities');
const { runSchemaFunc, getModelVars } = require('../../../schema_func');

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

  const { mapName, preCondition } = handler;
  const transforms = shortcuts[mapName][modelName];

  if (preCondition && !preCondition(mInput)) { return; }

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
  newDatum: model,
  currentDatum: previousModel,
  attrName,
}) {
  const vars = getModelVars({ model, previousModel, attrName });
  return condition(vars);
};

const transformAttr = function ({
  handler: { setAttr },
  newDatum: model,
  currentDatum: previousModel,
  attrName,
  transform,
  mInput,
}) {
  const vars = getModelVars({ model, previousModel, attrName });

  const transformA = runSchemaFunc({ schemaFunc: transform, mInput, vars });

  const newValA = setAttr({ transform: transformA, ...vars });

  // Normalize `null` to `undefined`
  const newValB = newValA === null ? undefined : newValA;

  return newValB;
};

module.exports = {
  handleTransforms,
};
