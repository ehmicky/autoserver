'use strict';


// Check if a definition is an array
const isMultiple = function (def) {
  return def.items !== undefined;
};

// Gets underlying definition if it is an array, otherwise returns as is
const getSubDef = function (def) {
  return isMultiple(def) ? def.items : def;
};

// Checks whether the definition is associated with a model
const isShallowModel = function (def) {
  return def.model !== undefined;
};

// Checks whether the definition is deeply associated with a model
const isModel = function (def) {
  return isShallowModel(getSubDef(def));
};


module.exports = {
  isMultiple,
  getSubDef,
  isModel,
  isShallowModel,
};
