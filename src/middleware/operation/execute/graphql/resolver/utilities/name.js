'use strict';

const { underscored } = require('underscore.string');

// Matches e.g. 'findMyModels' -> ['find', 'MyModels'];
const nameRegExp = /^([a-z0-9]+)([A-Z][a-zA-Z0-9]*)/;

// Parse a GraphQL query attribute name into tokens.
// E.g. `findMyModels` -> { actionType: 'find', attrName: 'my_models' }
const parseName = function ({ name }) {
  const [actionType, rawAttrName] = parseNameParts({ name });
  if (!actionType || !rawAttrName) { return {}; }

  const attrName = underscored(rawAttrName);

  return { actionType, attrName };
};

const parseNameParts = function ({ name }) {
  const parts = nameRegExp.exec(name);
  if (!parts) { return []; }

  const actionType = parts[1].trim();
  const rawAttrName = parts[2].trim();

  return [actionType, rawAttrName];
};

module.exports = {
  parseName,
};
