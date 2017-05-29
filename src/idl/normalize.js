'use strict';


const { find, omit, mapValues, difference } = require('lodash');

const { transform, map } = require('../utilities');
const { actions: allActions } = require('../constants');


// Normalize IDL definition
const normalizeIdl = function (idl) {
  idl.commands = normalizeCommandNames(idl.commands || defaultCommandNames);
  idl.models = normalizeModels({ idl });
  idl = normalizeHelpers({ idl });
  return idl;
};

// Normalize IDL definition models
const normalizeModels = function ({ idl }) {
  let { models, commands: defaultCommandNames } = idl;
  models = addModelType({ models });
  transform({ transforms, args: { defaultCommandNames } })({ input: models });
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
    // Normalize `commands` shortcuts, and adds defaults
    model({
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


// Normalize `commands` shortcuts, e.g. 'read' -> 'readOne' + 'readMany'
const normalizeCommandNames = function (commandNames) {
  return commandNames.reduce((memo, commandName) => {
    const normalizedCommandName = /(One)|(Many)$/.test(commandName)
      ? [commandName]
      : [`${commandName}One`, `${commandName}Many`];
    return [...memo, ...normalizedCommandName];
  }, []);
};

// By default, include all commandNames but deleteMany
const defaultCommandNames = [
  'createOne',
  'createMany',
  'readOne',
  'readMany',
  'updateOne',
  'updateMany',
  'deleteOne',
];

// Retrieve possible actions using possible commandNames
const getActions = function ({ commandNames }) {
  return allActions
    .filter(({ commandNames: requiredCommands }) => {
      return difference(requiredCommands, commandNames).length === 0;
    })
    .map(({ name }) => name);
};

// Normalize idl.helpers
const normalizeHelpers = function ({ idl }) {
  let { helpers = {} } = idl;

  if (helpers instanceof Array) {
    helpers = Object.assign({}, ...helpers);
  }
  // Helpers can either be an options object, or options.value directly
  helpers = map(helpers, helper => {
    return helper.value !== undefined ? helper : { value: helper };
  });

  const exposeMap = getExposeMap({ helpers });

  Object.assign(idl, { helpers, exposeMap });

  return idl;
};

// Possible values of helpers.HELPER.exposeTo
const exposeVars = ['filter', 'data'];

// Extract idl.helpers.HELPER.exposeTo ['filter', ...] to
// idl.exposeMap { filter: ['HELPER', ...] }
const getExposeMap = function ({ helpers }) {
  return exposeVars.reduce((memo, exposeVar) => {
    const matchingHelpers = Object.entries(helpers)
      .reduce((allHelpers, [helper, { exposeTo = [] }]) => {
        return exposeTo.includes(exposeVar)
          ? [...allHelpers, helper]
          : allHelpers;
      }, []);
    return Object.assign(memo, { [exposeVar]: matchingHelpers });
  }, {});
};


module.exports = {
  normalizeIdl,
};
