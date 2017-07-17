'use strict';

const { singular, plural } = require('pluralize');

const { parseName } = require('./utilities');

// Resolver for top-level models actions
const topLevelModelResolver = function ({ name, modelsMap }) {
  const { attrName, actionType } = parseName({ name });
  if (!attrName || !actionType) { return {}; }

  const singularName = singular(attrName);
  const pluralName = plural(attrName);
  // Guess whether the action is multiple by whether the attribute looks singular or plural
  const multiple = getMultiple({ attrName, singularName, pluralName });
  // Retrieve actual model name from the IDL
  const modelName = getModelName({ modelsMap, singularName, pluralName });
  return { multiple, modelName, actionType };
};

const getMultiple = function ({ attrName, singularName, pluralName }) {
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
