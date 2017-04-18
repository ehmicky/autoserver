'use strict';


const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const { chain, omit, pick, defaults } = require('lodash');
const { stringify } = require('circular-json');

const { GeneralCache } = require('../../../../utilities');
const { EngineError } = require('../../../../error');
const { getTypeName } = require('./name');
const { getDescription, getDeprecationReason } = require('./description');
const { isMultiple, getSubDef, getModelName, isModel } = require('./utilities');
const { getArguments } = require('./arguments');


// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  opts.inputObjectType = opts.inputObjectType || '';

  const typeGetter = graphQLTypeGetters.find(possibleType => possibleType.condition(def, opts));
  if (!typeGetter) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${stringify(def)}`, {
      reason: 'GRAPHQL_WRONG_DEFINITION',
    });
  }

  const type = typeGetter.value(def, opts);
  return type;
};

// Retrieves a GraphQL field info for a given IDL definition, i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  const type = getType(def, opts);
  const field = { type };

  // The following fields are type-agnostic, so are not inside `typeGetter.value()`
  // Fields description|deprecation_reason are taken from IDL definition
  const description = getDescription({ def, opType: opts.opType, descriptionType: 'field' });
  const deprecationReason = getDeprecationReason({ def });
  Object.assign(field, defaults({ description, deprecationReason }, field));

	// Only for top-level models, and not for argument types
  if (isModel(def) && opts.inputObjectType === '') {
    field.args = getArguments(def, Object.assign({ getType }, opts));
  }

  // Can only assign default if fields are optional in input, but required by database
  if (canRequireAttributes(def, opts) && def.required !== true && opts.inputObjectType === 'data'
    && def.default !== undefined) {
    defaults(field, { defaultValue: def.default });
  }

  return field;
};

// Required field typeGetter
const graphQLRequiredTypeGetter = function (def, opts) {
  // Goal is to avoid infinite recursion, i.e. without modification the same graphQLTypeGetter would be hit again
  const modifiedDef = Object.assign({}, def, { required: false });
  const subType = getType(modifiedDef, opts);
  const type = new GraphQLNonNull(subType);
  return type;
};

// Array field typeGetter
const graphQLArrayTypeGetter = function (def, opts) {
  const subDef = getSubDef(def);
  opts = Object.assign({}, opts, { multiple: true });
  const subType = getType(subDef, opts);
  const type = new GraphQLList(subType);
  return type;
};

// Done so that children can get a cached reference of parent type, while avoiding infinite recursion
// Only cache schemas that have a model name, because they are the only one that can recurse
// Namespace by operation, because operations can have slightly different types
const cache = new GeneralCache();
const memoizeObjectType = function (func) {
  return (def, opts) => {
    const modelName = getModelName(def);
    let key;
    if (modelName) {
      key = `${modelName}/${stringify(opts)}`;
      if (cache.exists(key)) {
        return cache.get(key);
      }
    }

    const type = func(def, opts);
    if (key) {
      cache.set(key, type);
    }
    return type;
  };
};

// Object field typeGetter
const graphQLObjectTypeGetter = memoizeObjectType(function (def, opts) {
  const { inputObjectType, opType, multiple, methodName } = opts;
  // Top-level methods do not have `def.model`
  const modelName = def.model || methodName;
  const name = getTypeName({ operation: { opType, multiple }, modelName, inputObjectType, methodName });

  const description = getDescription({ def, opType, descriptionType: 'type' });
	const constructor = inputObjectType !== '' ? GraphQLInputObjectType : GraphQLObjectType;
  const fields = getObjectFields(def, opts);

  const type = new constructor({ name, description, fields });
  return type;
});

const filterOpTypes = ['find', 'delete', 'update'];
// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (def, opts) {
  // This needs to be function, otherwise we run in an infinite recursion, if the children try to reference a parent type
  return () => chain(def.properties)
    // If parent has required ['childDefName'], adds childDef.required true|false, for convenience
    .mapValues((childDef, childDefName) => {
      if (def.required instanceof Array) {
        const required = def.required.includes(childDefName);
        childDef = Object.assign({}, childDef, { required });
      }
      return childDef;
    })
    // Model-related fields in input|filter arguments must be simple ids, not recursive definition
    // Exception: top-level operations
    .mapValues(childDef => {
      if (childDef.operation || !isModel(childDef) || opts.inputObjectType === '') { return childDef; }

      const subDef = getSubDef(childDef);

      // Retrieves `id` field definition of subfield
      const nonRecursiveAttrs = ['description', 'deprecation_reason', 'required'];
      const idDef = Object.assign({}, pick(subDef, nonRecursiveAttrs), omit(subDef.properties.id, nonRecursiveAttrs));

      // Assign `id` field definition to e.g. `model.user`
      const idsDef = isMultiple(childDef) ? Object.assign({}, childDef, { items: idDef }) : idDef;
      return idsDef;
    })
    // Remove recursive value fields when used as inputObject (i.e. resolver argument)
    .omitBy(childDef => opts.inputObjectType !== '' && isModel(childDef))
		// Remove all return value fields for delete operations, except the recursive ones and `id`
    // And except for inputObject, since we use it to get the delete filters
		.omitBy((childDef, childDefName) =>
      opts.opType === 'delete' && !isModel(childDef) && childDefName !== 'id' && opts.inputObjectType !== 'filter'
    )
    // Create operations do not include data.id
		.omitBy((childDef, childDefName) => opts.opType === 'create' && childDefName === 'id' && opts.inputObjectType === 'data')
    // Filter inputObjects for single operations only include `id`
		.omitBy((childDef, childDefName) =>
      filterOpTypes.includes(opts.opType) && childDefName !== 'id' && opts.inputObjectType === 'filter' && !opts.multiple
    )
		// Recurse over children
		.mapValues(childDef => {
			// if 'Query' or 'Mutation' objects, pass current operation down to sub-fields, and top-level definition
			if (childDef.operation) {
				opts = Object.assign({}, opts, { opType: childDef.operation.opType });
			}

      opts = Object.assign({}, opts, { multiple: false });
			const field = getField(childDef, opts);
      return Object.assign({}, field);
		})
		.value();
};

const canRequireAttributes = function (def, { opType, inputObjectType }) {
  // Update operation does not require any attribute in input object
	return !(opType === 'update' && inputObjectType === 'data')
    // Query inputObjects do not require any attribute, except filter.id for single operations
    && inputObjectType !== 'filter';
};

/**
 * Maps an IDL definition into a GraphQL field information, including type
 * The first matching one will be used, i.e. order matters: required modifier, then array modifier come first
 */
const graphQLTypeGetters = [

	// "Required" modifier type
  {
    condition: (def, opts) => def.required === true && canRequireAttributes(def, opts),
    value: graphQLRequiredTypeGetter,
  },

	// "Array" modifier type
  {
    condition: def => def.type === 'array',
    value: graphQLArrayTypeGetter,
  },

	// "Object" type
  {
    condition: def => def.type === 'object',
    value: graphQLObjectTypeGetter,
  },

	// "Int" type
  {
    condition: def => def.type === 'integer',
    value: () => GraphQLInt,
  },

	// "Float" type
  {
    condition: def => def.type === 'number',
    value: () => GraphQLFloat,
  },

	// "String" type
  {
    condition: def => def.type === 'string' || def.type === 'null',
    value: () => GraphQLString,
  },

	// "Boolean" type
  {
    condition: def => def.type === 'boolean',
    value: () => GraphQLBoolean,
  },

];


module.exports = {
  getType,
};
