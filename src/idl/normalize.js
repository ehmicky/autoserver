'use strict';


const { mapValues, chain, find, mapKeys, omit } = require('lodash');
const { underscored } = require('underscore.string');


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
  const isTopLevel = depth <= 1;
  ++depth;

  // Sort keys for transformation order predictability, but pass order should be used instead for that
  const newValues = Object.keys(value).sort()
    // Fire each transform, if defined
    .filter(name => transforms[name])
    .map(name => transforms[name]({ value, key, root, isTopLevel }));
  // Assign transforms return values, to a copy of `value`
  value = Object.assign({}, value, ...newValues);

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
 *  - {boolean} isTopLevel - is this one of the top-level models
 * Must return the new attributes to merge to `value`
 */
const allTransforms = [

  {

    // Normalize properties to underscored case
    properties({ value }) {
      const properties = mapKeys(value.properties, (_, propName) => underscored(propName));
      return { properties };
    },

  },

  {

    // { instanceof '...' } -> { type: 'object', instanceof: '...' }
    instanceof({ value, root, isTopLevel }) {
      let instance;
      if (!isTopLevel) {
        instance = find(root, model => model.instanceof === value.instanceof);
      }
      return { type: 'object', instance };
    },

    // { required: [...], properties: { prop: { ... } } } -> { properties: { prop: { required: true, ... } } }
    required({ value }) {
      // Make sure this is a top-level `required: [...]`, not a submodel `required: true` (created by this function)
      if (!(value.required instanceof Array)) { return value; }

      const newProperties = chain(value.properties)
        .pickBy((_, propName) => value.required.includes(propName))
        .mapValues(prop => Object.assign({}, prop, { required: true }))
        .value();
      const properties = Object.assign({}, value.properties, newProperties);
      return { required: undefined, properties };
    },

    // Adds def.title refering to property name
    // TODO: should detect whether child _could_ have `type` instead (i.e. is a JSON schema), as we want `type` to be optional
    type({ key }) {
      const title = underscored(key);
      return { title };
    },

  },

  {

    // Dereference `instanceof` pointers, using a shallow copy, except for few attributes
    instance({ value }) {
      const modelProps = omit(value.instance, allowedRecursiveKeys);
      return Object.assign(modelProps, { instance: undefined });
    },

  }

];

const allowedRecursiveKeys = [
  'instanceof',
  'description',
  'deprecation_reason',
  'required',
  'title',
];


module.exports = {
  normalizeIdl,
};
