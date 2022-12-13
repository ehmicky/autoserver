import { isObject } from './type.js'
import { checkObject } from './validate.js'

// Similar to Lodash mapValues(), but with vanilla JavaScript
export const mapValues = (obj, mapperFunc) =>
  generalMap({ obj, mapperFunc, iterationFunc: mapValuesFunc })

const mapValuesFunc = ({ key, obj, newValue }) => {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  obj[key] = newValue
  return obj
}

// Similar to map() for keys
export const mapKeys = (obj, mapperFunc) =>
  generalMap({ obj, mapperFunc, iterationFunc: mapKeysFunc })

const mapKeysFunc = ({ value, obj, newValue }) => {
  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  obj[newValue] = value
  return obj
}

const generalMap = ({ obj, mapperFunc, iterationFunc }) => {
  checkObject(obj)

  return Object.entries(obj).reduce((objA, [key, value]) => {
    const newValue = mapperFunc(value, key, obj)
    return iterationFunc({ value, key, obj: objA, newValue })
  }, {})
}

// Apply map() recursively
export const recurseMap = (
  value,
  mapperFunc,
  { key, onlyLeaves = true } = {},
) => {
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

const getRecurseFunc = (value) => {
  if (isObject(value)) {
    return mapValues.bind(undefined, value)
  }

  if (Array.isArray(value)) {
    return value.map.bind(value)
  }
}

export const fullRecurseMap = (value, mapperFunc, opts = {}) => {
  const optsA = { ...opts, onlyLeaves: false }
  return recurseMap(value, mapperFunc, optsA)
}
