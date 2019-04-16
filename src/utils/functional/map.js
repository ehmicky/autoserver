import { checkObject } from './validate.js'
import { isObject } from './type.js'

// Similar to Lodash mapValues(), but with vanilla JavaScript
export const mapValues = function(obj, mapperFunc) {
  return generalMap({ obj, mapperFunc, iterationFunc: mapValuesFunc })
}

const mapValuesFunc = function({ key, obj, newValue }) {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  obj[key] = newValue
  return obj
}

// Similar to map() for keys
export const mapKeys = function(obj, mapperFunc) {
  return generalMap({ obj, mapperFunc, iterationFunc: mapKeysFunc })
}

const mapKeysFunc = function({ value, obj, newValue }) {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  obj[newValue] = value
  return obj
}

const generalMap = function({ obj, mapperFunc, iterationFunc }) {
  checkObject(obj)

  return Object.entries(obj).reduce((objA, [key, value]) => {
    const newValue = mapperFunc(value, key, obj)
    return iterationFunc({ value, key, obj: objA, newValue })
  }, {})
}

// Apply map() recursively
export const recurseMap = function(
  value,
  mapperFunc,
  { key, onlyLeaves = true } = {},
) {
  const recurseFunc = getRecurseFunc(value)
  const nextValue = recurseFunc
    ? recurseFunc((child, childKey) =>
        recurseMap(child, mapperFunc, { key: childKey, onlyLeaves }),
      )
    : value

  if (recurseFunc && onlyLeaves) {
    return nextValue
  }

  return mapperFunc(nextValue, key)
}

const getRecurseFunc = function(value) {
  if (isObject(value)) {
    return mapValues.bind(null, value)
  }

  if (Array.isArray(value)) {
    return value.map.bind(value)
  }
}

export const fullRecurseMap = function(value, mapperFunc, opts = {}) {
  const optsA = { ...opts, onlyLeaves: false }
  return recurseMap(value, mapperFunc, optsA)
}
