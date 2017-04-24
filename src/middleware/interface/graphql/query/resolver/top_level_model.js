'use strict';


const { singular, plural } = require('pluralize');

const { parseName } = require('./utilities');


// Resolver for top-level models actions
const topLevelModelResolver = function ({ name, modelsMap }) {
  const { attrName, opType } = parseName({ name });
  if (!attrName || !opType) { return {}; }

  const singularName = singular(attrName);
  const pluralName = plural(attrName);
  // Guess whether the action is multiple by whether the attribute looks singular or plural
  const multiple = singularName === attrName ? false : pluralName === attrName ? true : null;
  // Retrieve actual model name from the IDL
  const modelName = modelsMap[singularName] ? singularName : modelsMap[pluralName] ? pluralName : null;
  return { multiple, modelName, opType };
};


module.exports = {
  topLevelModelResolver,
};
