import { isObject } from './type.js'

// Like Lodash merge() but faster and does not mutate input
export const deepMerge = (objA, objB, ...objects) => {
  if (objects.length !== 0) {
    const newObjA = deepMerge(objA, objB)
    return deepMerge(newObjA, ...objects)
  }

  if (objB === undefined) {
    return objA
  }

  if (!isObjectTypes(objA, objB)) {
    return objB
  }

  const rObjB = Object.entries(objB).map(([objBKey, objBVal]) => {
    const newObjBVal = deepMerge(objA[objBKey], objBVal)
    return { [objBKey]: newObjBVal }
  })
  return Object.assign({}, objA, ...rObjB)
}

const isObjectTypes = (objA, objB) => isObject(objA) && isObject(objB)
