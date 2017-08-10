'use strict';

const { throwError } = require('../error');

const merge = function (type, objA, ...objects) {
  if (objects.length === 0) { return objA; }

  if (objects.length === 1) {
    return simpleMerge({ objA, objects, type });
  }

  return recursiveMerge({ objA, objects, type });
};

const simpleMerge = function ({ objA, objects, type }) {
  const [objB] = objects;

  validateInputType({ objA, objB });
  validateInputSameTypes({ objA, objB });

  if (Array.isArray(objA) && Array.isArray(objB)) {
    return mergeMap[type].array({ arrayA: objA, arrayB: objB });
  }

  if (objA.constructor === Object) {
    return mergeObjects({ objA, objB, type });
  }
};

const validateInputType = function ({ objA, objB }) {
  const isInvalidType =
    (objA.constructor !== Object && !Array.isArray(objA)) ||
    (objB.constructor !== Object && !Array.isArray(objB));
  if (!isInvalidType) { return; }

  const message = `'deepMerge' utility cannot merge together objects with arrays: ${objA} and ${objB}`;
  throwError(message);
};

const validateInputSameTypes = function ({ objA, objB }) {
  const isDifferentTypes =
    (objA.constructor === Object && objB.constructor !== Object) ||
    (objA.constructor !== Object && objB.constructor === Object);
  if (!isDifferentTypes) { return; }

  const message = `'deepMerge' utility can only merge together objects or arrays: ${objA} and ${objB}`;
  throwError(message);
};

const mergeObjects = function ({ objA, objB, type }) {
  return Object.entries(objB).reduce(
    (newObjA, [objBKey, objBVal]) =>
      mergeObjectProp({ objA: newObjA, objBKey, objBVal, type }),
    objA,
  );
};

const mergeObjectProp = function ({ objA, objBKey, objBVal, type }) {
  const objAVal = objA[objBKey];
  const shouldDeepMerge = objAVal &&
    objBVal &&
    ((Array.isArray(objAVal) && Array.isArray(objBVal)) ||
    (objAVal.constructor === Object && objBVal.constructor === Object));
  const newVal = shouldDeepMerge
    ? mergeMap[type].top(objAVal, objBVal)
    : objBVal;
  return { ...objA, [objBKey]: newVal };
};

const concatArrays = function ({ arrayA, arrayB }) {
  return [...arrayA, ...arrayB];
};

const mergeArrays = function ({ arrayA, arrayB }) {
  const bigArray = arrayA.length >= arrayB.length ? arrayA : arrayB;
  return bigArray.map((value, index) =>
    (arrayA[index] === undefined ? arrayB[index] : arrayA[index]),
  );
};

const recursiveMerge = function ({ objA, objects, type }) {
  const newObjA = mergeMap[type].top(objA, objects[0]);
  const newObjects = objects.slice(1);
  return mergeMap[type].top(newObjA, ...newObjects);
};

// Deep merge objects and arrays (concatenates for arrays)
const deepMerge = merge.bind(null, 'deep');

// Deep merge objects and arrays (merge for arrays)
const fusionMerge = merge.bind(null, 'fusion');

const mergeMap = {
  deep: {
    top: deepMerge,
    array: concatArrays,
  },
  fusion: {
    top: fusionMerge,
    array: mergeArrays,
  },
};

module.exports = {
  deepMerge,
  fusionMerge,
};
