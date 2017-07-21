'use strict';

// Deep merge objects and arrays (concatenates for arrays)
const deepMerge = function (objA, ...objects) {
  if (!objA) { return; }

  if (objects.length === 0) { return objA; }

  if (objects.length === 1) {
    return simpleMerge({ objA, objects });
  }

  if (objects.length > 1) {
    return recursiveMerge({ objA, objects });
  }
};

const simpleMerge = function ({ objA, objects }) {
  const [objB] = objects;

  validateInput({ objA, objB });

  if (Array.isArray(objA)) {
    return [...objA, ...objB];
  }

  if (objA.constructor === Object) {
    return mergeObjects({ objA, objB });
  }
};

const validateInput = function ({ objA, objB }) {
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
};

const mergeObjects = function ({ objA, objB }) {
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
};

const recursiveMerge = function ({ objA, objects }) {
  const newObjA = deepMerge(objA, objects[0]);
  const newObjects = objects.slice(1);
  return deepMerge(newObjA, ...newObjects);
};

module.exports = {
  deepMerge,
};
