'use strict';


const { getParentModel, parseName } = require('./utilities');
const { attributeResolver } = require('./attribute');
const { addNestedId } = require('./nested_id');
const { EngineError } = require('../../../../../error');


// Resolver for nested model actions
const nestedModelResolver = function ({ name, modelsMap, parent, args }) {
  const { model, attrName, opType } = getNestedProp({ modelsMap, parent, name });

  // If it is a normal attribute which just returns its parent value
  if (!model) {
    return attributeResolver({ parent, name });
  }

  const { multiple, model: modelName } = model;
  // Add nested if to nested actions
  const directReturn = addNestedId({ parent, name, attrName, multiple, args, opType });

  return { multiple, modelName, opType, directReturn };
};

// Retrieves nested property, which can be a model or a simple attribute
const getNestedProp = function ({ modelsMap, parent, name }) {
  // Retrieves parent model
  const { modelName: parentModel, opType: parentOpType } = getParentModel(parent);

  // Retrieves nested property
  const { attrName, opType } = parseName({ name });
  const isModel = attrName && opType;
  const prop = modelsMap[parentModel] && modelsMap[parentModel][isModel ? attrName : name];

  // This means tried to do a nested action that does not exist
  if (!prop
  // This means nested action is not a simple attribute, or that it has different opType than parent
  || (isModel && (!prop.model || parentOpType !== opType))) {
    throw new EngineError(`In ${parentModel} model, attribute ${name} does not exist`, { reason: 'INPUT_VALIDATION' });
  }

  const model = isModel ? prop : null;
  return { model, attrName, opType };
};


module.exports = {
  nestedModelResolver,
};
