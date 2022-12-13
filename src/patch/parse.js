import { isObject } from '../utils/functional/type.js'

// Check if this is a patch operation, e.g. `{ _add: 10 }`
export const isPatchOp = (patchOp) =>
  isObject(patchOp) && Object.keys(patchOp).some(isPatchOpName)

// Patch operations are prefixed with _ to differentiate from nested attributes
export const isPatchOpName = (key) => key.startsWith('_')

export const parsePatchOp = (patchOp) => {
  if (!isPatchOp(patchOp)) {
    return {}
  }

  const [[type, opVal]] = Object.entries(patchOp)
  return { type, opVal }
}
