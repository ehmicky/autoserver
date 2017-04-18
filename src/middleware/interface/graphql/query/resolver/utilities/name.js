'use strict';


const { underscored, camelize, capitalize } = require('underscore.string');
const { singular } = require('pluralize');


// Matches e.g. 'findMyModels' -> ['find', 'MyModels'];
const nameRegExp = /^([a-z0-9]+)([A-Z][a-zA-Z0-9]*)/;
/**
 * Parse a GraphQL query attribute name into tokens.
 * E.g. `findMyModels` -> { opType: 'find', attrName: 'my_models' }
 **/
const parseName = function ({ name }) {
  const parts = nameRegExp.exec(name);
  if (!parts) { return {}; }

  const opType = parts[1].trim();
  if (!opType) { return {}; }

  const rawAttrName = parts[2].trim();
  if (!rawAttrName) { return {}; }

  const attrName = underscored(rawAttrName);

  return { opType, attrName };
};


// Similar to introspection utility `getTypeName`
const getTypeName = function (name) {
  return capitalize(camelize(singular(name)));
};


module.exports = {
  parseName,
  getTypeName,
};
