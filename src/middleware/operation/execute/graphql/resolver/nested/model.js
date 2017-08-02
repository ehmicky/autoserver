'use strict';

const { throwError } = require('../../../../../../error');
const { getParentModel, parseName } = require('../utilities');
const { attributeResolver } = require('../attribute');

const { addNestedArg } = require('./arg');

// Resolver for nested model actions
const nestedModelResolver = function ({ name, modelsMap, parent, args }) {
  const { model, attrName, actionType } = getNestedProp({
    modelsMap,
    parent,
    name,
  });

  // If it is a normal attribute which just returns its parent value
  if (!model) {
    return attributeResolver({ parent, name, args });
  }

  const { multiple, target: modelName } = model;
  // Add nested if to nested actions
  // Uses the parent value as a nested filter|data
  const parentVal = parent[attrName];
  const { directReturn, args: argsA } = addNestedArg({
    parentVal,
    name,
    multiple,
    args,
    actionType,
  });

  return { multiple, modelName, actionType, directReturn, args: argsA };
};

// Retrieves nested property, which can be a model or a simple attribute
const getNestedProp = function ({ modelsMap, parent, name }) {
  // Retrieves parent model
  const {
    modelName: parentModel,
    action: parentAction,
    nonNestedModel,
  } = getParentModel(parent);

  // This means this is an object attribute that is not a nested model
  if (nonNestedModel) { return {}; }

  // Retrieves nested property
  const { attrName, actionType } = parseName({ name });
  const isModel = attrName && actionType;
  const prop = modelsMap[parentModel] &&
    modelsMap[parentModel][isModel ? attrName : name];

  validateProp({ prop, isModel, parentAction, parentModel, name, actionType });

  const model = isModel ? prop : null;
  return { model, attrName, actionType };
};

const validateProp = function ({
  prop,
  isModel,
  parentAction,
  parentModel,
  name,
  actionType,
}) {
  const doesNotExist =
    // This means tried to do a nested action that does not exist
    !prop ||
    // This means nested action is not a simple attribute,
    // or that it has different actionType than parent
    (
      isModel &&
      (prop.target === undefined || parentAction.type !== actionType)
    );
  if (!doesNotExist) { return; }

  const message = `In ${parentModel} model, attribute ${name} does not exist`;
  throwError(message, { reason: 'INPUT_VALIDATION' });
};

module.exports = {
  nestedModelResolver,
};
