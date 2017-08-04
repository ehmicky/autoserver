'use strict';

const { singular, plural } = require('pluralize');

const { parseName } = require('./utilities');

// Resolver for top-level models actions
const topLevelModelResolver = function ({ name, modelsMap, args }) {
  const { attrName, actionType } = parseName({ name });
  if (!attrName || !actionType) { return { args }; }

  const singularName = singular(attrName);
  const pluralName = plural(attrName);
  // Guess whether the action is multiple by whether the attribute
  // looks singular or plural
  const isArray = getIsArray({ attrName, singularName, pluralName });
  // Retrieve actual model name from the IDL
  const modelName = getModelName({ modelsMap, singularName, pluralName });
  return { isArray, modelName, actionType, args };
};

const getIsArray = function ({ attrName, singularName, pluralName }) {
  if (attrName === singularName) { return false; }
  if (attrName === pluralName) { return true; }
  return null;
};

const getModelName = function ({ modelsMap, singularName, pluralName }) {
  if (modelsMap[singularName]) {
    return singularName;
  }

  if (modelsMap[pluralName]) {
    return pluralName;
  }

  return null;
};

module.exports = {
  topLevelModelResolver,
};
