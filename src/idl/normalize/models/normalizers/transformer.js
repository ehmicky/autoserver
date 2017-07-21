'use strict';

const { difference } = require('lodash');

const { ACTIONS } = require('../../../../constants');
const { transform, omit } = require('../../../../utilities');
const { normalizeCommandNames } = require('../../commands');

const transformModels = function ({
  idl: { commands: defaultCommandNames },
  models,
}) {
  transform({ transforms, args: { defaultCommandNames } })({ input: models });
  return models;
};

// List of transformations to apply to normalize IDL models
const transforms = [

  {
    // Defaults `type` for arrays
    any ({ parent: { type, items } }) {
      if (type || !items) { return; }
      return { type: 'array' };
    },
  },

  {
    // Defaults `model` and `type` for top-level models
    any ({ parent: { model, modelType }, parentKey }) {
      if (modelType !== 'model') { return; }
      return { type: 'object', model: model || parentKey };
    },
  },

  {
    // Defaults `type` for nested attributes
    any ({ parent: { type, modelType, model } }) {
      if (modelType !== 'attribute' || type) { return; }
      const finalType = model ? 'object' : 'string';
      return { type: finalType };
    },
  },

  {
    // Do not allow custom properties
    model: () => ({ additionalProperties: false }),
  },

  {
    // Parent: specified or default
    // Attribute: intersection of parent model * referred model * specified
    // Normalize `commands` shortcuts, and adds defaults
    model ({
      defaultCommandNames,
      parent: { commands: commandNames = defaultCommandNames },
    }) {
      const normalizedCommandNames = normalizeCommandNames(commandNames);
      const actions = getActions({ commandNames: normalizedCommandNames });
      return { commands: normalizedCommandNames, actions };
    },
  },

  {
    // { model '...' } -> { model: '...', ...copyOfTopLevelModel }
    model ({ value, parent, parents: [rootParent] }) {
      const [, instance] = Object.entries(rootParent)
        .find(([modelName]) => modelName === value);
      if (instance === parent) { return; }
      // Dereference `model` pointers, using a shallow copy,
      // while avoiding overriding any property already defined
      const newProps = omit(instance, Object.keys(parent));
      return newProps;
    },
  },

];

// Retrieve possible actions using possible commandNames
const getActions = function ({ commandNames }) {
  return ACTIONS
    .filter(({ commandNames: requiredCommands }) =>
      difference(requiredCommands, commandNames).length === 0
    )
    .map(({ name }) => name);
};

module.exports = {
  transformModels,
};
