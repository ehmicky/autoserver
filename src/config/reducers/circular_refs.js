import { throwError } from '../../errors/main.js'
import { mapValues } from '../../utils/functional/map.js'
import { isObjectType } from '../../utils/functional/type.js'

// There should be no circular references.
// They may be introduced by e.g. dereferencing JSON references `$ref`
// or YAML anchors `*var`
export const validateCircularRefs = ({ config }) => {
  validateCircRefs(config)
}

const validateCircRefs = (
  value,
  { path = 'config', pathSet = new WeakSet() } = {},
) => {
  if (pathSet.has(value)) {
    const message = `The configuration cannot contain circular references: '${path}'`
    throwError(message, { reason: 'CONFIG_VALIDATION' })
  }

  if (!isObjectType(value)) {
    return
  }

  walkCircularRefs(value, { path, pathSet })
}

const walkCircularRefs = (value, { path, pathSet }) => {
  pathSet.add(value)

  const iterator = Array.isArray(value)
    ? value.map.bind(value)
    : mapValues.bind(undefined, value)
  iterator((child, childKey) => {
    const childPath = Array.isArray(value)
      ? `${path}[${childKey}]`
      : `${path}.${childKey}`
    validateCircRefs(child, { path: childPath, pathSet })
  })

  pathSet.delete(value)
}
