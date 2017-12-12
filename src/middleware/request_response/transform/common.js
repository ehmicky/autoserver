'use strict';

const { mapValues, pickBy } = require('../../../utilities');
const { runConfigFunc, getModelVars } = require('../../../functions');

// Handles `attr.value`, `attr.default` and `attr.readonly`
const handleTransforms = function ({
  mapName,
  preCondition,
  condition,
  setAttr,
  args,
  args: { newData, currentData },
  collname,
  config: { shortcuts },
  mInput,
}) {
  if (newData === undefined) { return; }

  const transforms = shortcuts[mapName][collname];

  if (preCondition && !preCondition(mInput)) { return; }

  const newDataA = newData.map((newDatum, index) => transformDatum({
    condition,
    setAttr,
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

const filterTransforms = function ({ condition, transforms, ...rest }) {
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
  currentDatum: previousmodel,
  attrName,
}) {
  const vars = getModelVars({ model, previousmodel, attrName });
  return condition(vars);
};

const transformAttr = function ({
  setAttr,
  newDatum: model,
  currentDatum: previousmodel,
  attrName,
  transform,
  mInput,
}) {
  const vars = getModelVars({ model, previousmodel, attrName });

  const transformA = runConfigFunc({ configFunc: transform, mInput, vars });

  const newValA = setAttr({ transform: transformA, ...vars });

  // Normalize `null` to `undefined`
  const newValB = newValA === null ? undefined : newValA;

  return newValB;
};

module.exports = {
  handleTransforms,
};
