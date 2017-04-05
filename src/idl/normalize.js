'use strict';


const { find, omit } = require('lodash');

const { transform } = require('../utilities');


// Normalize IDL definition
const normalizeIdl = function (idl) {
  idl.models = normalizeModels(idl.models);
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
    any({ depth, key }) {
      let depthType;
      if (depth === 1) {
        depthType = 'model';
      } else if (depth === 3) {
        depthType = 'singleAttr';
      } else if (depth === 4 && key === 'items') {
        depthType = 'multipleAttr';
      }
      return { depthType };
    },
  },

  {
    // { instanceof '...' } -> { type: 'object', instanceof: '...' }
    instanceof: () => ({ type: 'object' }),

    // Adds def.propName refering to property name
    type({ key, parent }) {
      // Only for top-level models and single attributes
      if (!['model', 'singleAttr'].includes(parent.depthType)) { return; }
      return { propName: key };
    },

    // Add model.instanceof to top-level models
    any({ key, parent }) {
      if (parent.depthType !== 'model') { return; }
      return { instanceof: key };
    },
  },

  {
    // { instanceof '...' } -> { instanceof: '...', ...copyOfTopLevelModel }
    // Must be last because this is done by copy, not reference
    instanceof({ value, root, parent }) {
      if (!['singleAttr', 'multipleAttr'].includes(parent.depthType)) { return; }
      const instance = find(root, (_, modelName) => modelName === value);
      // Make sure we do not copy `required` attribute from top-level model
      const keysToProtect = Object.keys(parent).concat('required');
      // Dereference `instanceof` pointers, using a shallow copy, except for few attributes
      // copy only the keys from top-level model not defined in submodel
      const newProps = omit(instance, keysToProtect);
      // Avoid infinite recursion
      newProps.__noRecurse = true;
      return newProps;
    },
  },

];


module.exports = {
  normalizeIdl,
};
