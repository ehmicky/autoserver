'use strict';


const { chain } = require('lodash');
const { underscored, camelize, capitalize } = require('underscore.string');
const { singular } = require('pluralize');

const { operations } = require('../../../../../../idl');


/**
 * Parse a GraphQL query attribute name into tokens.
 * E.g. `findMyModels` -> { opType: 'find', attrName: 'my_models' }
 **/
const parseName = function ({ name }) {
  const parts = opTypeRegExp.exec(name);
  if (!parts) { return {}; }

  const opType = parts[1].trim();
  if (!opType) { return {}; }

  const rawAttrName = parts[2].trim();
  if (!rawAttrName) { return {}; }

  const attrName = underscored(rawAttrName);

  return { opType, attrName };
};

// Creates RegExp like /^(?:create)|(?:find)|.../, i.e. checks that a word starts with an operation name
const opTypes = chain(operations)
  .map(op => `(?:${op.opType.toLowerCase()})`)
  .sort()
  .uniq()
  .value()
  .join('|');
const opTypeRegExp = new RegExp(`^(${opTypes})([A-Z][a-zA-Z0-9]*)`);

// Similar to introspection utility `getTypeName`
const getTypeName = function (name) {
  return capitalize(camelize(singular(name)));
};


module.exports = {
  parseName,
  getTypeName,
};
