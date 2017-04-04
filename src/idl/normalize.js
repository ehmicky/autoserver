'use strict';


const { mapValues, find, omit, pickBy } = require('lodash');


// Normalize IDL definition
const normalizeIdl = function (idl) {
  idl.models = normalizeModels(idl.models);
  return idl;
};

// Normalize IDL definition models
const normalizeModels = function (models) {
  return allTransforms.reduce((value, transforms) => {
    // Apply transformations in several passes, i.e. allTransforms[0], then allTransforms[1], etc.
    return transformModels({ value, key: 'models', transforms });
  }, models);
};

// Normalize IDL definition models, with one set of transforms
const transformModels = function ({ value, key, transforms, root, depth = 0 }) {
  // 'instance' check avoids infinite recursion
  if (!value || value.constructor !== Object || key === 'instance') { return value; }

  // Keep track of root and depth level
  root = root || value;
  // Depth 1 means top-level model, depth 3 means model attribute, depth 4 means model array attribute's item
  const type = [,'model',,'singleAttr','multipleAttr'][depth] || 'other';
  ++depth;

  // Sort keys for transformation order predictability, but pass order should be used instead for that
  const newValues = Object.keys(value).sort()
    .concat('any')
    // Fire each transform, if defined
    .filter(name => transforms[name])
    .map(name => transforms[name]({ value, key, root, type }))
    .filter(values => values);
  // Assign transforms return values, to a copy of `value`
  value = Object.assign({}, value, ...newValues);
  // Remove undefined values
  value = pickBy(value, val => val !== undefined);

  // Recurse over children
  return mapValues(value, (child, childKey) => transformModels({ value: child, key: childKey, transforms, root, depth }));
};

/**
 * List of transformations to apply to normalize IDL models
 * The top-level index is the pass number
 * The key is the property name on the model or any object inside the definition
 * Each function is fired with the following options:
 *  - {object} value - parent object
 *  - {string} key - parent object's key
 *  - {object} root - root object
 *  - {number} type - 'model', 'singleAttr', 'multipleAttr' or 'other'
 * Must return the new attributes to merge to `value`
 */
const allTransforms = [

  {
    // { instanceof '...' } -> { type: 'object', instanceof: '...' }
    instanceof({ value, root, type }) {
      let instance;
      if (type.endsWith('Attr')) {
        instance = find(root, (_, modelName) => modelName === value.instanceof);
      }
      return { type: 'object', instance };
    },

    // Adds def.propName refering to property name
    type({ key, type }) {
      // Only for top-level models and single attributes
      if (!['model', 'singleAttr'].includes(type)) { return; }
      return { propName: key };
    },
  },

  {
    // Dereference `instanceof` pointers, using a shallow copy, except for few attributes
    instance({ value }) {
      // Make sure we do not copy `required` attribute from top-level model
      const keysToProtect = Object.keys(value).concat('required');
      // copy only the keys from top-level model not defined in submodel
      const modelProps = omit(value.instance, keysToProtect);
      return Object.assign(modelProps, { instance: undefined });
    },

    // Add model.instanceof to top-level models
    any({ key, type }) {
      if (type !== 'model') { return; }
      return { instanceof: key };
    },
  }

];


module.exports = {
  normalizeIdl,
};
