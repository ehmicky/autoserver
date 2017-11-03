'use strict';

const { handleTransforms } = require('./common');

// Apply `attr.default` only on model creation (on `create` or `upsert`),
// and the attribute is missing
const shouldSetDefault = function ({ $previousModel, $val }) {
  return $previousModel === undefined && $val == null;
};

const setTransform = function ({ transform }) {
  return transform;
};

const setCurrentValIfTrue = function ({ transform, $previousVal, $val }) {
  if (!transform) { return $val; }

  return $previousVal;
};

// `attr.value`
const handleValue = handleTransforms.bind(null, {
  mapName: 'valuesMap',
  setAttr: setTransform,
});

// `attr.default`
const handleUserDefault = handleTransforms.bind(null, {
  mapName: 'userDefaultsMap',
  condition: shouldSetDefault,
  setAttr: setTransform,
});

// `attr.readonly`
// Sets attributes marked in schema as `readonly` to their current value
// (i.e. `currentData`)
// This is done silently (i.e. does not raise warnings or errors),
// because readonly attributes can be part of a normal response, and clients
// should be able to send responses back as is without having to remove
// readonly attributes, even if another user changes that same model.
const handleReadonly = handleTransforms.bind(null, {
  mapName: 'readonlyMap',
  setAttr: setCurrentValIfTrue,
});

module.exports = {
  handleValue,
  handleReadonly,
  handleUserDefault,
};
