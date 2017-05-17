'use strict';


const { find, omit, mapValues, difference } = require('lodash');

const { transform } = require('../utilities');
const { compileIdlJsl } = require('./jsl');
const { actions } = require('./actions');


// Normalize IDL definition
const normalizeIdl = function (idl) {
  idl.calls = normalizeDbCalls(idl.calls || defaultDbCalls);
  idl.models = normalizeModels(idl);
  idl = compileIdlJsl({ idl });
  return idl;
};

// Normalize IDL definition models
const normalizeModels = function (idl) {
  let { models, calls: defaultDbCalls } = idl;
  models = addModelType({ models });
  transform({ transforms, args: { defaultDbCalls } })({ input: models });
  return models;
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
    // Normalize calls shortcuts, and adds defaults
    model({ defaultDbCalls, parent: { calls = defaultDbCalls } }) {
      const normalizedDbCalls = normalizeDbCalls(calls);
      const actions = getActions({ dbCalls: normalizedDbCalls });
      return { calls: normalizedDbCalls, actions };
    }
  },

  {
    // { model '...' } -> { model: '...', ...copyOfTopLevelModel }
    model({ value, parent, parents: [root] }) {
      const instance = find(root, (_, modelName) => modelName === value);
      if (instance === parent) { return; }
      // Dereference `model` pointers, using a shallow copy,
      // while avoiding overriding any property already defined
      const newProps = omit(instance, Object.keys(parent));
      return newProps;
    },
  },

];


// Normalize `calls` shortcuts, e.g. 'read' -> 'readOne' + 'readMany'
const normalizeDbCalls = function (dbCalls) {
  return dbCalls.reduce((memo, dbCall) => {
    const normalizedDbCall = /(One)|(Many)$/.test(dbCall)
      ? dbCall
      : [`${dbCall}One`, `${dbCall}Many`];
    return memo.concat(normalizedDbCall);
  }, []);
};

// By default, include all calls but deleteMany
const defaultDbCalls = ['read', 'update', 'deleteOne', 'create'];

// Retrieve possible actions using possible dbCalls
const getActions = function ({ dbCalls }) {
  return actions
    .filter(({ dbCalls: calls }) => difference(calls, dbCalls).length === 0)
    .map(({ name }) => name);
};


module.exports = {
  normalizeIdl,
};
