'use strict';

const { omit } = require('../../utilities');

// Sets attributes marked in IDL as `readonly` to their current value
// (i.e. `currentData`)
// This is done silently (i.e. does not raise warnings or errors),
// because readonly attributes can be part of a normal response, and clients
// should be able to send responses back as is without having to remove
// readonly attributes.
const handleReadonly = function ({
  args,
  args: { newData, currentData },
  modelName,
  idl: { shortcuts: { readonlyMap } },
}) {
  // If no `currentData`, this means the model does not exist yet,
  // i.e. this is a create command, or an upsert resulting in creation,
  // or a future 404.
  // Readonly does not apply then.
  if (!newData || !currentData) { return; }

  const attrs = readonlyMap[modelName];
  const newDataA = newData.map((newDatum, index) => removeAttrs({
    newData: newDatum,
    currentData: currentData[index],
    attrs,
  }));

  return { args: { ...args, newData: newDataA } };
};

const removeAttrs = function ({ newData, currentData, attrs }) {
  if (!currentData) { return newData; }

  return attrs.reduce(
    (newDataA, attr) => removeAttr({ newData: newDataA, currentData, attr }),
    newData,
  );
};

const removeAttr = function ({ newData, currentData, attr }) {
  if (currentData[attr] == null) {
    return omit(newData, attr);
  }

  return { ...newData, [attr]: currentData[attr] };
};

module.exports = {
  handleReadonly,
};
