'use strict';


// Deep merge objects and arrays (concatenates for arrays)
const deepMerge = function (objA, objB, ...objects) {
  if (!objA) { return; }
  if (!objB) { return objA; }
  if (objects.length > 0) {
    return deepMerge(deepMerge(objA, objB), ...objects);
  }

  const isInvalidType =
    (objA.constructor !== Object && !(objA instanceof Array)) ||
    (objB.constructor !== Object && !(objB instanceof Array));
  const isDifferentTypes =
    (objA.constructor === Object && objB.constructor !== Object) ||
    (objA.constructor !== Object && objB.constructor === Object);
  if (isInvalidType || isDifferentTypes) {
    const message = `'deepMerge' utility can only merge together objects or arrays: ${JSON.stringify(objA)} and ${JSON.stringify(objB)}`;
    throw new Error(message);
  }

  if (objA instanceof Array) {
    return [...objA, ...objB];
  }

  if (objA.constructor === Object) {
    const newObjA = Object.assign({}, objA);
    for (const [objBKey, objBVal] of Object.entries(objB)) {
      const objAVal = newObjA[objBKey];
      const shouldDeepMerge = objAVal &&
        objBVal &&
        ((objAVal instanceof Array && objBVal instanceof Array) ||
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
