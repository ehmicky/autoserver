'use strict';

// Deep merge objects and arrays (concatenates for arrays)
const deepMerge = function (objA, ...objects) {
  if (!objA) { return; }

  if (objects.length === 0) { return objA; }

  if (objects.length > 1) {
    const newObjA = deepMerge(objA, objects[0]);
    const newObjects = objects.slice(1);
    return deepMerge(newObjA, ...newObjects);
  }

  const [objB] = objects;
  const isInvalidType =
    (objA.constructor !== Object && !Array.isArray(objA)) ||
    (objB.constructor !== Object && !Array.isArray(objB));
  const isDifferentTypes =
    (objA.constructor === Object && objB.constructor !== Object) ||
    (objA.constructor !== Object && objB.constructor === Object);

  if (isInvalidType || isDifferentTypes) {
    const message = `'deepMerge' utility can only merge together objects or arrays: ${JSON.stringify(objA)} and ${JSON.stringify(objB)}`;
    throw new Error(message);
  }

  if (Array.isArray(objA)) {
    return [...objA, ...objB];
  }

  if (objA.constructor === Object) {
    const newObjA = Object.assign({}, objA);

    for (const [objBKey, objBVal] of Object.entries(objB)) {
      const objAVal = newObjA[objBKey];
      const shouldDeepMerge = objAVal &&
        objBVal &&
        ((Array.isArray(objAVal) && Array.isArray(objBVal)) ||
        (objAVal.constructor === Object && objBVal.constructor === Object));
      newObjA[objBKey] = shouldDeepMerge
        ? deepMerge(objAVal, objBVal)
        : objBVal;
    }

    return newObjA;
  }
};

module.exports = {
  deepMerge,
};
