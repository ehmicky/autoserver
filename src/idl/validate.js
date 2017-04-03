'use strict';


const { forEach, findKey, intersection, find } = require('lodash');

const { EngineStartupError } = require('../error');
const { recursivePrint } = require('../utilities');


const validateIdl = function (idl) {
  validateModels(idl.models, { topLevelModels: idl.models });
};

const validateModels = function (obj, { topLevelModels }) {
  if (typeof obj !== 'object') { return obj; }

  forEach(obj, (child, attrName) => {
    // `instanceof` must be the only attribute (unless top-level), as it will reference another schema,
    // except for also description and related attributes
    if (child.instanceof && topLevelModels !== obj) {
      const wrongKey = findKey(child, (_, key) => !allowedRecursiveKeys.includes(key));
      if (wrongKey) {
        throw new EngineStartupError(`The following definition cannot have the key '${wrongKey}': ${recursivePrint(child)}`, {
          reason: 'IDL_WRONG_DEFINITION',
        });
      }
      const topLevelModel = find(topLevelModels, model => model.instanceof === child.instanceof);
      if (!topLevelModel) {
        throw new EngineStartupError(`Could not find model with "instanceof" '${child.instanceof}': ${recursivePrint(child)}`, {
          reason: 'IDL_WRONG_DEFINITION',
        });
      }
    }

    if (typeof child === 'object') {
      // Definitions of type `object` must have valid `properties`
      if (child.type === 'object' && !child.instanceof) {
        if (!child.properties || typeof child.properties !== 'object' || Object.keys(child.properties).length === 0) {
          throw new EngineStartupError(`The following definition of type 'object' is missing 'properties': ${recursivePrint(child)}`, {
            reason: 'IDL_WRONG_DEFINITION',
          });
        }
      }
    }

		if (attrName === 'required' && child instanceof Array) {
			obj.required.forEach(requiredName => {
				const prop = obj.properties[requiredName];
				if (!prop) {
					throw new EngineStartupError(`"${requiredName}" is specified as "required", but is not defined: ${recursivePrint(obj)}`, {
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
					throw new EngineStartupError(`operation "${operation}" does not exist: ${recursivePrint(obj)}`, {
						reason: 'IDL_WRONG_DEFINITION',
					});
        }
      });

      const readOpPrefixes = ['find', 'findOne', 'findMany'];
      if (intersection(readOpPrefixes, child).length === 0) {
				throw new EngineStartupError(`operation "find" must be specified: ${recursivePrint(obj)}`, {
					reason: 'IDL_WRONG_DEFINITION',
				});
      }
    }

    // Recurse over children
    validateModels(child, { topLevelModels });
  }, {});

  return obj;
};

const allowedRecursiveKeys = [
  'instanceof',
  'description',
  'deprecation_reason',
  'required',
  'title'
];


module.exports = {
  validateIdl,
};
