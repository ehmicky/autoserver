'use strict';

// Like Lodash merge() but faster and does not mutate input
const deepMerge = function (objA, objB, ...objects) {
  if (objects.length > 0) {
    const newObjA = deepMerge(objA, objB);
    return deepMerge(newObjA, ...objects);
  }

  if (!isObjectTypes(objA, objB)) { return objB; }

  const rObjB = Object.entries(objB).map(([objBKey, objBVal]) => {
    const newObjBVal = deepMerge(objA[objBKey], objBVal);
    return { [objBKey]: newObjBVal };
  });
  return Object.assign({}, objA, ...rObjB);
};

const isObjectTypes = function (objA, objB) {
  return objA && objA.constructor === Object &&
    objB && objB.constructor === Object;
};

module.exports = {
  deepMerge,
};
