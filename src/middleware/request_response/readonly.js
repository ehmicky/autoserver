'use strict';

const { omit, pick, pickBy } = require('../../utilities');
const { runSchemaFunc } = require('../../schema_func');

// Sets attributes marked in schema as `readonly` to their current value
// (i.e. `currentData`)
// This is done silently (i.e. does not raise warnings or errors),
// because readonly attributes can be part of a normal response, and clients
// should be able to send responses back as is without having to remove
// readonly attributes.
const handleReadonly = function ({
  args,
  args: { newData, currentData },
  modelName,
  schema: { shortcuts: { readonlyMap } },
  mInput,
}) {
  if (newData === undefined) { return; }

  const attrs = readonlyMap[modelName];

  const newDataA = newData.map((newDatum, index) => removeAttrs({
    newDatum,
    currentDatum: currentData[index],
    attrs,
    mInput,
  }));

  return { args: { ...args, newData: newDataA } };
};

const removeAttrs = function ({ newDatum, currentDatum, attrs, mInput }) {
  const attrsA = getReadonlyAttrs({ attrs, newDatum, currentDatum, mInput });
  const newDatumA = removeReadonlyAttrs({
    newDatum,
    currentDatum,
    attrs: attrsA,
  });
  return newDatumA;
};

// Retrieve which attributes are readonly
const getReadonlyAttrs = function ({ attrs, newDatum, currentDatum, mInput }) {
  const attrsA = pickBy(
    attrs,
    (readonly, attrName) => isReadonly({
      readonly,
      newDatum,
      currentDatum,
      attrName,
      mInput,
    }),
  );
  const attrsB = Object.keys(attrsA);
  return attrsB;
};

const isReadonly = function ({
  readonly,
  newDatum,
  currentDatum,
  attrName,
  mInput,
}) {
  const oldVal = currentDatum == null ? undefined : currentDatum[attrName];
  const vars = {
    $model: newDatum,
    $val: newDatum[attrName],
    $oldModel: currentDatum,
    $oldVal: oldVal,
  };
  const readonlyA = runSchemaFunc({ schemaFunc: readonly, mInput, vars });
  return Boolean(readonlyA) === true;
};

// Silently sets `newDatum` back to `currentDatum`
const removeReadonlyAttrs = function ({ newDatum, currentDatum, attrs }) {
  // E.g. on `create` or `upsert` actions
  if (currentDatum === undefined) {
    return omit(newDatum, attrs);
  }

  const previousDatum = pick(currentDatum, attrs);
  const nullDatum = pickBy(previousDatum, attr => attr == null);
  const nonNullDatum = pickBy(previousDatum, attr => attr != null);

  const newDatumA = { ...newDatum, ...nonNullDatum };
  const newDatumB = omit(newDatumA, Object.keys(nullDatum));
  return newDatumB;
};

module.exports = {
  handleReadonly,
};
