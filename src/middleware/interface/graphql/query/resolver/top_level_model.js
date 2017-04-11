'use strict';


const { singular, plural } = require('pluralize');


// Resolver for top-level models operations
const topLevelModelResolver = function ({ attrName, modelsMap }) {
  const singularName = singular(attrName);
  const pluralName = plural(attrName);
  // Guess whether the operation is multiple by whether the attribute looks singular or plural
  const multiple = singularName === attrName ? false : pluralName === attrName ? true : null;
  // Retrieve actual model name from the IDL
  const modelName = modelsMap[singularName] ? singularName : modelsMap[pluralName] ? pluralName : null;
  return { multiple, modelName };
};


module.exports = {
  topLevelModelResolver,
};
