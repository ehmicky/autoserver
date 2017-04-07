'use strict';


const { find, omit } = require('lodash');

const { transform } = require('../utilities');


// Normalize IDL definition
const normalizeIdl = function (idl) {
  idl.models = normalizeModels(idl.models);
  idl.operations = idl.operations || defaultOperations;
  return idl;
};

// Normalize IDL definition models
const normalizeModels = function (models) {
  return transform({ transforms })({ input: models });
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

    // Adds def.propName refering to property name
    type({ parentKey, parent }) {
      // Only for top-level models and single attributes
      if (!['model', 'singleAttr'].includes(parent.depthType)) { return; }
      return { propName: parentKey };
    },

    // Add `model` to top-level models
    any({ parentKey, parent }) {
      if (parent.depthType !== 'model') { return; }
      return { model: parentKey };
    },
  },

  {
    // { model '...' } -> { model: '...', ...copyOfTopLevelModel }
    // Must be last because this is done by copy, not reference
    model({ value, root, parent }) {
      if (!['singleAttr', 'multipleAttr'].includes(parent.depthType)) { return; }
      const instance = find(root, (_, modelName) => modelName === value);
      // Make sure we do not copy `required` attribute from top-level model
      const keysToProtect = Object.keys(parent).concat('required');
      // Dereference `model` pointers, using a shallow copy, except for few attributes
      // copy only the keys from top-level model not defined in submodel
      const newProps = omit(instance, keysToProtect);
      // Avoid infinite recursion
      newProps.__noRecurse = true;
      return newProps;
    },
  },

];

// By default, include all operations but deleteMany
const defaultOperations = ['find', 'update', 'deleteOne', 'replace', 'upsert', 'create'];


module.exports = {
  normalizeIdl,
};
