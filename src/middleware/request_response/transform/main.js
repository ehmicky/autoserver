import { handleTransforms } from './common.js'

// Apply `attr.default` only on model creation (on `create` or `upsert`),
// and the attribute is missing
const shouldUseDefault = function ({ command }) {
  return DEFAULT_COMMANDS.has(command)
}

const DEFAULT_COMMANDS = new Set(['create', 'upsert'])

const shouldSetDefault = function ({ value }) {
  return value === undefined || value === null
}

const setTransform = function ({ transform }) {
  return transform
}

const setCurrentValIfTrue = function ({ transform, previousvalue, value }) {
  if (!transform) {
    return value
  }

  return previousvalue
}

// `attr.value`
export const handleValue = function (mInput) {
  return handleTransforms({
    ...mInput,
    mapName: 'valuesMap',
    setAttr: setTransform,
  })
}

// `attr.default`
export const handleUserDefault = function (mInput) {
  return handleTransforms({
    ...mInput,
    mapName: 'userDefaultsMap',
    preCondition: shouldUseDefault,
    condition: shouldSetDefault,
    setAttr: setTransform,
  })
}

// `attr.readonly`
// Sets attributes marked in config as `readonly` to their current value
// (i.e. `currentData`)
// This is done silently (i.e. does not raise warnings or errors),
// because readonly attributes can be part of a normal response, and clients
// should be able to send responses back as is without having to remove
// readonly attributes, even if another user changes that same model.
export const handleReadonly = function (mInput) {
  return handleTransforms({
    ...mInput,
    mapName: 'readonlyMap',
    setAttr: setCurrentValIfTrue,
  })
}
