'use strict';


const { find, omit } = require('lodash');

const { transform } = require('../utilities');


// Normalize IDL definition
const normalizeIdl = function (idl) {
  idl.operations = normalizeOperations(idl.operations || defaultOperations);
  idl.models = normalizeModels(idl);
  return idl;
};

// Normalize IDL definition models
const normalizeModels = function ({ models, operations }) {
  transform({ transforms, args: { defaultOperations: operations } })({ input: models });
  return models;
};

// List of transformations to apply to normalize IDL models
const transforms = [

  {
    // Add `model` to top-level models
    type({ value, parent, parentKey }) {
      if (value !== 'object' || parent.model) { return; }
      return { model: parentKey };
    },
  },

  {
    // Do not allow custom properties
    model: () => ({ additionalProperties: false }),
  },

  {
    // Parent: specified or default
    // Attribute: intersection of parent model * referred model * specified
    // Normalize operations shortcuts, and adds defaults
    model({ defaultOperations, parent: { operations = defaultOperations } }) {
      const normalizedOperations = normalizeOperations(operations);
      return { operations: normalizedOperations };
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


// Normalize operations hortcuts, e.g. 'find' -> 'findOne' + 'findMany'
const normalizeOperations = function (operations) {
  return operations.reduce((memo, operation) => {
    const normalizedOperation = /(One)|(Many)$/.test(operation) ? operation : [`${operation}One`, `${operation}Many`];
    return memo.concat(normalizedOperation);
  }, []);
};

// By default, include all operations but deleteMany
const defaultOperations = ['find', 'update', 'deleteOne', 'replace', 'upsert', 'create'];


module.exports = {
  normalizeIdl,
};
