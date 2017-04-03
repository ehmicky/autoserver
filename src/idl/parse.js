'use strict';


const { mapValues, chain, merge, values, forEach, findKey, intersection, find, mapKeys, omit } = require('lodash');
const { underscored } = require('underscore.string');
const { EngineError } = require('../error');
const { recursivePrint } = require('../utilities');
const { parseFile } = require('./formats');


// Retrieves IDL definition, after validation and transformation
// TODO: cache this function
const getIdl = function (definitions) {
  let obj = typeof definitions === 'string' ? parseFile(definitions) : definitions;
  // Deep copy, so we do not modify input
  obj = merge({}, obj);
  const models = validateIdlDefinition(obj).models;
  // Transform from object to array, throwing away the property key
  obj.models = values(models);
  return obj;
};

// Validate IDL definition
// Also performs some transformation, e.g. adding default values
// TODO: use JSON schema validation|transformation instead
// TODO: move all validation into this method
const validateIdlDefinition = function (obj) {
  validateModelsDefinition(obj.models, { topLevelModels: obj.models });
  obj.models = normalizeModels(obj.models);
  return obj;
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
  'title'
];

const validateModelsDefinition = function (obj, { topLevelModels }) {
  if (typeof obj !== 'object') { return obj; }

  forEach(obj, (child, attrName) => {
    // `instanceof` must be the only attribute (unless top-level), as it will reference another schema,
    // except for also description and related attributes
    if (child.instanceof && topLevelModels !== obj) {
      const wrongKey = findKey(child, (_, key) => !allowedRecursiveKeys.includes(key));
      if (wrongKey) {
        throw new EngineError(`The following definition cannot have the key '${wrongKey}': ${recursivePrint(child)}`, {
          reason: 'IDL_WRONG_DEFINITION',
        });
      }
      const topLevelModel = find(topLevelModels, model => model.instanceof === child.instanceof);
      if (!topLevelModel) {
        throw new EngineError(`Could not find model with "instanceof" '${child.instanceof}': ${recursivePrint(child)}`, {
          reason: 'IDL_WRONG_DEFINITION',
        });
      }
    }

    if (typeof child === 'object') {
      // Definitions of type `object` must have valid `properties`
      if (child.type === 'object' && !child.instanceof) {
        if (!child.properties || typeof child.properties !== 'object' || Object.keys(child.properties).length === 0) {
          throw new EngineError(`The following definition of type 'object' is missing 'properties': ${recursivePrint(child)}`, {
            reason: 'IDL_WRONG_DEFINITION',
          });
        }
      }
    }

		if (attrName === 'required' && child instanceof Array) {
			obj.required.forEach(requiredName => {
				const prop = obj.properties[requiredName];
				if (!prop) {
					throw new EngineError(`"${requiredName}" is specified as "required", but is not defined: ${recursivePrint(obj)}`, {
						reason: 'IDL_WRONG_DEFINITION',
					});
				}
			});
		}

    if (attrName === 'operations' && child instanceof Array) {
      const opPrefixes = ['find', 'update', 'upsert', 'delete', 'create', 'replace'].reduce((memo, opPrefix) =>
        memo.concat([opPrefix, `${opPrefix}One`, `${opPrefix}Many`])
      , []);
      child.forEach(operation => {
        if (!opPrefixes.includes(operation)) {
					throw new EngineError(`operation "${operation}" does not exist: ${recursivePrint(obj)}`, {
						reason: 'IDL_WRONG_DEFINITION',
					});
        }
      });

      const readOpPrefixes = ['find', 'findOne', 'findMany'];
      if (intersection(readOpPrefixes, child).length === 0) {
				throw new EngineError(`operation "find" must be specified: ${recursivePrint(obj)}`, {
					reason: 'IDL_WRONG_DEFINITION',
				});
      }
    }

    // Recurse over children
    validateModelsDefinition(child, { topLevelModels });
  }, {});

  return obj;
};


module.exports = {
  getIdl,
};
