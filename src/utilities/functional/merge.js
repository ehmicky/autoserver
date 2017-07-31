'use strict';

const { throwError } = require('../error');

// Deep merge objects and arrays (concatenates for arrays)
const deepMerge = function (objA, ...objects) {
  if (objects.length === 0) { return objA; }

  if (objects.length === 1) {
    return simpleMerge({ objA, objects });
  }

  return recursiveMerge({ objA, objects });
};

const simpleMerge = function ({ objA, objects }) {
  const [objB] = objects;

  validateInputType({ objA, objB });
  validateInputSameTypes({ objA, objB });

  if (Array.isArray(objA)) {
    return [...objA, ...objB];
  }

  if (objA.constructor === Object) {
    return mergeObjects({ objA, objB });
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

const mergeObjects = function ({ objA, objB }) {
  return Object.entries(objB).reduce(
    (newObjA, [objBKey, objBVal]) =>
      mergeObjectProp({ objA: newObjA, objBKey, objBVal }),
    objA,
  );
};

const mergeObjectProp = function ({ objA, objBKey, objBVal }) {
  const objAVal = objA[objBKey];
  const shouldDeepMerge = objAVal &&
    objBVal &&
    ((Array.isArray(objAVal) && Array.isArray(objBVal)) ||
    (objAVal.constructor === Object && objBVal.constructor === Object));
  const newVal = shouldDeepMerge ? deepMerge(objAVal, objBVal) : objBVal;
  return { ...objA, [objBKey]: newVal };
};

const recursiveMerge = function ({ objA, objects }) {
  const newObjA = deepMerge(objA, objects[0]);
  const newObjects = objects.slice(1);
  return deepMerge(newObjA, ...newObjects);
};

module.exports = {
  deepMerge,
};
