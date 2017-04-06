'use strict';


// Check if a definition is an array
const isMultiple = function (def) {
  return def.items !== undefined;
};

// Gets underlying definition if it is an array, otherwise returns as is
const getSubDef = function (def) {
  return isMultiple(def) ? def.items : def;
};

// Gets either array property, or array item property, with priority for upper level
const getSubDefProp = function (def, propName) {
  return def[propName] || getSubDef(def)[propName];
};

// Retrieves model name from a definition
const getModelName = function (def) {
  return getSubDef(def).model;
};

// Checks whether the definition is associated with a model
const isModel = function (def) {
  return getModelName(def) !== undefined;
};

// Checks whether the definition is associated with a model, or is an array whose items are
const isDeepModel = function (def) {
  return getSubDefProp(def, 'model') !== undefined;
};


module.exports = {
  isMultiple,
  getSubDef,
  getSubDefProp,
  getModelName,
  isModel,
  isDeepModel,
};
