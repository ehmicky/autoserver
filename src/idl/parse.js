'use strict';


const { merge, values, forEach, findKey, intersection, find, omit, mapKeys } = require('lodash');
const { underscored } = require('underscore.string');
const { EngineError } = require('../error');
const { recursivePrint } = require('../utilities');


// Retrieves IDL definition, after validation and transformation
const getIdl = function (obj) {
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
  fixInstances(obj.models);
  return obj;
};

const validateModelsDefinition = function (obj, { topLevelModels }) {
  if (typeof obj !== 'object') { return obj; }

  forEach(obj, (child, attrName) => {
    // Avoid infinite recursion
    if (attrName === 'instance') { return; }

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
      child.instance = topLevelModel;
    }

    if (typeof child === 'object') {
      // TODO: should detect whether child _could_ have `type` instead (i.e. is a JSON schema), as we want `type` to be optional
      // Adds def.title default value, by using parent property name
      if (child.type && !child.title) {
        child.title = attrName;
      }
      // Definitions of type `object` must have valid `properties`
      if (child.type === 'object' && !child.instanceof) {
        if (!child.properties || typeof child.properties !== 'object' || Object.keys(child.properties).length === 0) {
          throw new EngineError(`The following definition of type 'object' is missing 'properties': ${recursivePrint(child)}`, {
            reason: 'IDL_WRONG_DEFINITION',
          });
        }
      }
    }

    // Normalize attributes to underscored case
    if (attrName === 'properties') {
      obj.properties = mapKeys(obj.properties, (_, propName) => underscored(propName));
    }

    // { instanceof '...' } -> { type: 'object', instanceof: '...' }
    if (attrName === 'instanceof' && !obj.type) {
      obj.type = 'object';
    }

		if (attrName === 'required' && child instanceof Array) {
			obj.required.forEach(requiredName => {
				const prop = obj.properties[requiredName];
				if (!prop) {
					throw new EngineError(`"${requiredName}" is specified as "required", but is not defined: ${recursivePrint(obj)}`, {
						reason: 'IDL_WRONG_DEFINITION',
					});
				}
				obj.properties[requiredName].required = true;
			});
			delete obj.required;
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

// Dereference `instanceof` pointers, using a shallow copy, except for few attributes
const fixInstances = function (obj) {
  if (typeof obj !== 'object') { return; }

  if (obj.instance) {
    Object.assign(obj, omit(obj.instance, allowedRecursiveKeys));
    delete obj.instance;
    return;
  }

  // Recursion
  forEach(obj, child => fixInstances(child));
};

const allowedRecursiveKeys = [
  'instanceof',
  'description',
  'deprecation_reason',
  'required',
];


module.exports = {
  getIdl,
};