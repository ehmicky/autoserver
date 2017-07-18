'use strict';

// Keeps track of the modelName associated with each response,
// so each child resolver knows what's the current model
const parentModelMap = new WeakMap();

const setParentModel = function (parent, props) {
  // Database responses can be array of objects, or single object
  const parents = Array.isArray(parent) ? parent : [parent];
  parents.forEach(item => {
    if (!item || typeof item !== 'object') { return; }
    parentModelMap.set(item, props);
  });
};

const getParentModel = function (parent) {
  return parentModelMap.get(parent) || {};
};

const hasParentModel = function (parent) {
  return parentModelMap.has(parent);
};

module.exports = {
  setParentModel,
  getParentModel,
  hasParentModel,
};
