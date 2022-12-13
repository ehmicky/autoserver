import { includeKeys, excludeKeys } from 'filter-obj'

import { get, set, has } from '../../utils/functional/get_set.js'
import { isObject } from '../../utils/functional/type.js'

// Reduce the size of parameters that might be too big
export const reduceParams = ({ params }) => {
  const paramsB = attributes.reduce(
    (paramsA, { path, filter }) =>
      reduceInfo({ params: paramsA, path, filter }),
    params,
  )
  const paramsC = excludeKeys(paramsB, isUndefined)
  return paramsC
}

const attributes = [
  { path: ['queryvars'], filter: ['operationName'] },
  { path: ['payload'], filter: ['id', 'operationName'] },
  { path: ['args', 'data'], filter: ['id'] },
  { path: ['responsedata'], filter: ['id'] },
]

const reduceInfo = ({ params, path, filter }) => {
  if (!has(params, path)) {
    return params
  }

  const value = get(params, path)
  const valueA = reduceValue({ value, filter })

  const paramsA = set(params, path, valueA)
  return paramsA
}

const reduceValue = ({ value, filter }) => {
  if (Array.isArray(value)) {
    return value.filter(isObject).map((obj) => includeKeys(obj, filter))
  }

  if (isObject(value)) {
    return includeKeys(value, filter)
  }

  // Otherwise, removes value altogether
}

const isUndefined = (key, value) => value === undefined
