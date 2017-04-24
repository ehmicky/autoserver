'use strict';


const { find, omit, mapValues } = require('lodash');

const { transform } = require('../utilities');


// Normalize IDL definition
const normalizeIdl = function (idl) {
  idl.actions = normalizeActions(idl.actions || defaultActions);
  idl.models = normalizeModels(idl);
  return idl;
};

// Normalize IDL definition models
const normalizeModels = function ({ models, actions }) {
  models = addModelType({ models });
  transform({ transforms, args: { defaultActions: actions } })({ input: models });
  return models;
};

// Add modelType `model` to top-level models, `attribute` to model attributes (including nested models)
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
    any({ parent: { type, items } }) {
      if (type || !items) { return; }
      return { type: 'array' };
    },
  },

  {
    // Defaults `model` and `type` for top-level models
    any({ parent: { model, modelType }, parentKey }) {
      if (modelType !== 'model') { return; }
      return { type: 'object', model: model || parentKey };
    },
  },

  {
    // Defaults `type` for nested attributes
    any({ parent: { type, modelType, model } }) {
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
    // Normalize actions shortcuts, and adds defaults
    model({ defaultActions, parent: { actions = defaultActions } }) {
      const normalizedActions = normalizeActions(actions);
      return { actions: normalizedActions };
    }
  },

  {
    // { model '...' } -> { model: '...', ...copyOfTopLevelModel }
    model({ value, root, parent }) {
      const instance = find(root, (_, modelName) => modelName === value);
      if (instance === parent) { return; }
      // Dereference `model` pointers, using a shallow copy, while avoiding overriding any property already defined
      const newProps = omit(instance, Object.keys(parent));
      return newProps;
    },
  },

];


// Normalize actions shortcuts, e.g. 'find' -> 'findOne' + 'findMany'
const normalizeActions = function (actions) {
  return actions.reduce((memo, action) => {
    const normalizedAction = /(One)|(Many)$/.test(action) ? action : [`${action}One`, `${action}Many`];
    return memo.concat(normalizedAction);
  }, []);
};

// By default, include all actions but deleteMany
const defaultActions = ['find', 'update', 'deleteOne', 'replace', 'upsert', 'create'];


module.exports = {
  normalizeIdl,
};
