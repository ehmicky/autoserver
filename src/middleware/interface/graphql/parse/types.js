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
const { chain, defaults } = require('lodash');

const { EngineError } = require('../../../../error');
const { getTypeName } = require('./name');
const { getDescription, getDeprecationReason } = require('./description');
const { findOperations } = require('./models');
const { getArguments } = require('./arguments');


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
  const modelName = def.instanceof;
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
  // The following fields are type-agnostic, so are not inside `fieldInfo.value()`
  Object.assign(field, { description, deprecationReason });
	// Can only assign default if fields are optional in input, but required by database
	if (canRequireAttributes(def, opts) && !def.required && opts.isInputObject && def.default !== undefined) {
		field.defaultValue = def.default;
	}

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
    condition: (def, opts) => {
			return def.required && canRequireAttributes(def, opts);
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
			Object.assign(fieldInfo, getResolver(subDef, true, opts));

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
					return chain(def.properties)
						// Remove all return value fields for delete operations, except the recursive ones
            // And except for inputObject, since we use it to get the delete filters
						.pickBy(childDef => {
							const model = childDef.instanceof || (childDef.items && childDef.items.instanceof);
							return !(opts.opType === 'delete' && !model && !opts.isInputObject);
						})
						// Recurse over children
						.mapValues(childDef => {
							// if 'Query' or 'Mutation' objects, pass current operation down to sub-fields
							if (childDef.opType) {
								opts = Object.assign({}, opts, { opType: childDef.opType });
							}

							return getField(childDef, opts);
						})
						.value();
        },
      });

      const fieldInfo = { type };
			Object.assign(fieldInfo, getResolver(def, false, opts));

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

const canRequireAttributes = function (def, { opType, isInputObject }) {
  // Update operation does not require any attribute in input object, except `id`
	return !(
    opType === 'update'
		&& isInputObject
		&& !(def.type === 'integer' && def.format === 'id')
  // Query inputObjects do not require any attribute
  ) && !(
    ['find', 'delete'].includes(opType)
    && isInputObject
  );
};

// Gets a resolver (and args) to add to a GraphQL field
const getResolver = function (def, multiple, opts) {
	// Only for top-level models, and not for argument types
  if (!def.instanceof || opts.isInputObject) { return; }

  const opType = opts.opType;
  const operation = findOperations({ opType, multiple });
	const resolve = async function (_, args, { callback }) {
    return await executeOperation({ operation, args, callback });
  };

	// Builds inputObject type
	const inputObjectOpts = Object.assign({}, opts, { isInputObject: true });
	const inputObjectType = getType(def, inputObjectOpts);

	const args = getArguments({ multiple, opType: opts.opType, inputObjectType });

  return { args, resolve };
};

// Fires an operation in the database layer
const executeOperation = async function ({ operation, args = {}, callback }) {
  const response = await callback({ operation, args });
  return response;
};


module.exports = {
  getType,
};