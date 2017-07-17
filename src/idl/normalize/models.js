'use strict';

const { transform, omit, mapValues } = require('../../utilities');
const { normalizeCommandNames } = require('./commands');
const { getActions } = require('./actions');
const { normalizeAllTransforms } = require('./transform');
const { normalizeAliases } = require('./alias');

// Normalize IDL definition models
const normalizeModels = function ({ idl }) {
  let { models, commands: defaultCommandNames } = idl;
  models = addModelType({ models });
  models = normalizeAllTransforms({ models });
  models = normalizeAliases({ models });
  transform({ transforms, args: { defaultCommandNames } })({ input: models });
  idl.models = models;
  return idl;
};

// Add modelType `model` to top-level models, `attribute` to model attributes
// (including nested models)
// Used as extra hints for transforms
const addModelType = function ({ models }) {
  return mapValues(models, model => {
    const properties = mapValues(model.properties, prop => {
      prop = Object.assign({}, prop, { modelType: 'attribute' });
      if (prop.items) {
        prop.items = Object.assign({}, prop.items, { modelType: 'attribute' });
      }
      return prop;
    });
    return Object.assign({}, model, { modelType: 'model', properties });
  });
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
      type = model ? 'object' : 'string';
      return { type };
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
    }
  },

  {
    // { model '...' } -> { model: '...', ...copyOfTopLevelModel }
    model ({ value, parent, parents: [root] }) {
      const [, instance] = Object.entries(root)
        .find(([modelName]) => modelName === value);
      if (instance === parent) { return; }
      // Dereference `model` pointers, using a shallow copy,
      // while avoiding overriding any property already defined
      const newProps = omit(instance, Object.keys(parent));
      return newProps;
    },
  },

];

module.exports = {
  normalizeModels,
};
