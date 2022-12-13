import { handleTransforms } from './common.js'

// Apply `attr.default` only on model creation (on `create` or `upsert`),
// and the attribute is missing
const shouldUseDefault = ({ command }) => DEFAULT_COMMANDS.has(command)

const DEFAULT_COMMANDS = new Set(['create', 'upsert'])

const shouldSetDefault = ({ value }) => value === undefined || value === null

const setTransform = ({ transform }) => transform

const setCurrentValIfTrue = ({ transform, previousvalue, value }) => {
  if (!transform) {
    return value
  }

  return previousvalue
}

// `attr.value`
export const handleValue = (mInput) =>
  handleTransforms({
    ...mInput,
    mapName: 'valuesMap',
    setAttr: setTransform,
  })

// `attr.default`
export const handleUserDefault = (mInput) =>
  handleTransforms({
    ...mInput,
    mapName: 'userDefaultsMap',
    preCondition: shouldUseDefault,
    condition: shouldSetDefault,
    setAttr: setTransform,
  })

// `attr.readonly`
// Sets attributes marked in config as `readonly` to their current value
// (i.e. `currentData`)
// This is done silently (i.e. does not raise warnings or errors),
// because readonly attributes can be part of a normal response, and clients
// should be able to send responses back as is without having to remove
// readonly attributes, even if another user changes that same model.
export const handleReadonly = (mInput) =>
  handleTransforms({
    ...mInput,
    mapName: 'readonlyMap',
    setAttr: setCurrentValIfTrue,
  })
