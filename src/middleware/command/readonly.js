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
    newData: newDatum,
    currentData: currentData[index],
    attrs,
    mInput,
  }));

  return { args: { ...args, newData: newDataA } };
};

const removeAttrs = function ({ newData, currentData, attrs, mInput }) {
  const attrsA = getReadonlyAttrs({ attrs, newData, mInput });
  const newDataA = removeReadonlyAttrs({ newData, currentData, attrs: attrsA });
  return newDataA;
};

// Retrieve which attributes are readonly
const getReadonlyAttrs = function ({ attrs, newData, mInput }) {
  const attrsA = pickBy(
    attrs,
    (readonly, attrName) => isReadonly({ readonly, newData, attrName, mInput }),
  );
  const attrsB = Object.keys(attrsA);
  return attrsB;
};

const isReadonly = function ({ readonly, newData, attrName, mInput }) {
  const vars = { $model: newData, $val: newData[attrName] };
  const readonlyA = runSchemaFunc({ schemaFunc: readonly, mInput, vars });
  return Boolean(readonlyA) === true;
};

// Silently sets `newData` back to `currentData`
const removeReadonlyAttrs = function ({ newData, currentData, attrs }) {
  // E.g. on `create` actions
  if (currentData === undefined) {
    return omit(newData, attrs);
  }

  const previousData = pick(currentData, attrs);
  const nullData = pickBy(previousData, data => data == null);
  const nonNullData = pickBy(previousData, data => data != null);

  const newDataA = { ...newData, ...nonNullData };
  const newDataB = omit(newDataA, Object.keys(nullData));
  return newDataB;
};

module.exports = {
  handleReadonly,
};
