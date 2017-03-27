'use strict';


const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const { mapValues, defaults } = require('lodash');

const { EngineError } = require('../../../../error');
const { getTypeName } = require('./name');
const { getDescription, getDeprecationReason } = require('./description');
const { getResolver } = require('./resolver');


// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  return getField(def, opts).type;
};

// Retrieves a GraphQL field info for a given IDL definition, i.e. an object that can be passed to new GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  // Add field description|deprecation_reason, taken from IDL definition
  const description = getDescription({ def, opType: opts.opType, multiple: def.items !== undefined });
  const deprecationReason = getDeprecationReason({ def });

  // Done so that children can get a cached reference of parent type, while avoiding infinite recursion
  // Only cache schemas that have a model name, because they are the only one that can recurse
  // Namespace by operation, because operations can have slightly different types
  const modelName = def.model;
	const inputObjectType = opts.isInputObject ? 'inputObject' : 'generic';
  const key = modelName && `field/${modelName}/${opts.opType}/${inputObjectType}`;
  if (key && opts.cache.exists(key)) {
    const cachedDef = opts.cache.get(key);
    // Sub-models can override top-level models descriptions
    return defaults({}, cachedDef, { description, deprecationReason });
  }

  // Retrieves correct field
  const fieldInfo = graphQLFieldsInfo.find(possibleType => possibleType.condition(def, opts));
  if (!fieldInfo) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  // Retrieves field information
  const field = fieldInfo.value(def, opts);
  // The field description|deprecationReason is type-agnostic, so is not inside `fieldInfo.value()`
  Object.assign(field, { description, deprecationReason });

  if (key) {
    opts.cache.set(key, field);
  }
  return field;
};

/**
 * Maps an IDL definition into a GraphQL field information, including type
 * The first matching one will be used, i.e. order matters: required modifier, then array modifier come first
 */
const graphQLFieldsInfo = [

	// "Required" modifier type
  {
    condition: (def, { opType, isInputObject }) => {
			// Update operation does not require any attribute in input object, except `id`
			if (opType === 'update' && isInputObject && !(def.type === 'integer' && def.format === 'id')) {
				return false;
			}
			return def.required;
		},
    value(def, opts) {
      // Goal is to avoid infinite recursion, i.e. without modification the same graphQLFieldsInfo would be hit again
      const modifiedDef = Object.assign({}, def, { required: false });
      const subType = getType(modifiedDef, opts);
      const type = new GraphQLNonNull(subType);
      return { type };
    },
  },

	// "Array" modifier type
  {
    condition: def => def.type === 'array' && typeof def.items === 'object',
    value(def, opts) {
      const subDef = def.items;
      const subType = getType(subDef, opts);
      const type = new GraphQLList(subType);

      const fieldInfo = { type };
			Object.assign(fieldInfo, getResolver({ def: subDef, multiple: true, getType, opts }));

      return fieldInfo;
    },
  },

	// "Object" type
  {
    condition: def => def.type === 'object',
    value(def, opts) {
      const opType = opts.opType;
      const name = getTypeName({ def, opType, isInputObject: Boolean(opts.isInputObject) });
      const description = getDescription({ def, opType });

			const constructor = opts.isInputObject ? GraphQLInputObjectType : GraphQLObjectType;
      const type = new constructor({
        name,
        description,
        // This needs to be function, otherwise we run in an infinite recursion,
        // if the children try to reference a parent type
        fields() {
          // Recurse over children
          return mapValues(def.properties, childDef => {
            // if 'Query' or 'Mutation' objects, pass current operation down to sub-fields
            if (childDef.opType) {
              opts = Object.assign({}, opts, { opType: childDef.opType });
						}

            return getField(childDef, opts);
          });
        },
      });

      const fieldInfo = { type };
			Object.assign(fieldInfo, getResolver({ def, multiple: false, getType, opts }));

      return fieldInfo;
    },
  },

	// "ID" type
  {
    condition: def => def.type === 'integer' && def.format === 'id',
    value: () => ({ type: GraphQLID }),
  },

	// "Int" type
  {
    condition: def => def.type === 'integer',
    value: () => ({ type: GraphQLInt }),
  },

	// "Float" type
  {
    condition: def => def.type === 'number',
    value: () => ({ type: GraphQLFloat }),
  },

	// "String" type
  {
    condition: def => def.type === 'string',
    value: () => ({ type: GraphQLString }),
  },

	// "Boolean" type
  {
    condition: def => def.type === 'boolean',
    value: () => ({ type: GraphQLBoolean }),
  },

];


module.exports = {
  getType,
};