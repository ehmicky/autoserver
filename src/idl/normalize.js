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
  return transform({ transforms, args: { operations } })({ input: models });
};

// List of transformations to apply to normalize IDL models
const transforms = [

  {
    // Depth 1 means top-level model, depth 3 means model attribute, depth 4 means model array attribute's item
    any({ depth, parentKey, parent }) {
      if (parent.$data || parent.$ref) { return; }

      let depthType;
      if (depth === 1) {
        depthType = 'model';
      } else if (depth >= 3) {
        if (['items', 'contains'].includes(parentKey)) {
          depthType = 'multipleAttr';
        } else if (!['properties', 'patternProperties', 'dependencies'].includes(parentKey)) {
          depthType = 'singleAttr';
        }
      }
      return { depthType };
    },
  },

  {
    // { model '...' } -> { type: 'object', model: '...' }
    model: () => ({ type: 'object' }),

    // Do not allow custom properties
    properties: () => ({ additionalProperties: false }),

    // Adds def.propName refering to property name
    type({ parentKey, parent }) {
      // Only for top-level models and single attributes
      if (!['model', 'singleAttr'].includes(parent.depthType)) { return; }
      return { propName: parentKey };
    },
  },

  {
    // Normalize operations shortcuts, and adds defaults
    any({ parent: { depthType, operations }, operations: defaultOperations }) {
      if (depthType !== 'model') { return; }
      operations = operations || defaultOperations;
      const normalizedOperations = normalizeOperations(operations || defaultOperations);
      return { operations: normalizedOperations };
    }
  },

  {
    // { model '...' } -> { model: '...', ...copyOfTopLevelModel }
    model({ value, root, parent }) {
      const instance = find(root, (_, modelName) => modelName === value);
      // Dereference `model` pointers, using a shallow copy, while avoiding overriding any property already defined
      const newProps = omit(instance, Object.keys(parent));
      return newProps;
    },
  },

  {
    // Add `model` to top-level models
    any({ parentKey, parent }) {
      if (parent.depthType !== 'model') { return; }
      return { model: parentKey };
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
