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
const { chain, omit, pick } = require('lodash');
const { stringify } = require('circular-json');
const uuidv4 = require('uuid/v4');

const { EngineError } = require('../../../../error');
const { memoize } = require('../../../../utilities');
const { getTypeName } = require('./name');
const { getSubDef, isModel } = require('./utilities');
const { getArguments } = require('./arguments');


// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts = {}) {
  return getField(def, opts).type;
};

// Retrieves a GraphQL field info for a given IDL definition, i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  opts.inputObjectType = opts.inputObjectType || '';

  const typeGetter = graphQLTypeGetters.find(possibleType => possibleType.condition(def, opts));
  if (!typeGetter) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${stringify(def)}`, {
      reason: 'GRAPHQL_WRONG_DEFINITION',
    });
  }

  const type = typeGetter.value(def, opts);

  // Fields description|deprecation_reason are taken from IDL definition
  const description = def.description;
  const deprecationReason = def.deprecated;

	// Only for models, and not for argument types
  let args;
  const subDef = getSubDef(def);
  if (isModel(subDef) && opts.inputObjectType === '') {
    args = getArguments(subDef, Object.assign(opts, { getType }));
  }

  // Can only assign default if fields are optional in input, but required by database
  let defaultValue;
  if (canRequireAttributes(def, opts) && !opts.isRequired && opts.inputObjectType === 'data') {
    defaultValue = def.default;
  }

  const field = { type, description, deprecationReason, args, defaultValue };
  return field;
};

// Required field typeGetter
const graphQLRequiredTypeGetter = function (def, opts) {
  // Goal is to avoid infinite recursion, i.e. without modification the same graphQLTypeGetter would be hit again
  opts = Object.assign({}, opts, { isRequired: false });
  const subType = getType(def, opts);
  const type = new GraphQLNonNull(subType);
  return type;
};

// Array field typeGetter
const graphQLArrayTypeGetter = function (def, opts) {
  const subDef = getSubDef(def);
  const subType = getType(subDef, opts);
  const type = new GraphQLList(subType);
  return type;
};

/**
 * Memoize object type constructor in order to infinite recursion.
 * We use the type name, i.e.:
 *  - type name must differ everytime type might differ
 *  - in particular, at the moment, type name differ when inputObjectType, opType or multiple changes
 * We also namespace with a UUID which is unique for each new call to `getSchema()`, to avoid leaking
 **/
const objectTypeSerializer = function ([ def, opts ]) {
  const typeName = getTypeName({ def, opts });
  opts.schemaId = opts.schemaId || uuidv4();
  return `${opts.schemaId}/${typeName}`;
};

// Object field typeGetter
const graphQLObjectTypeGetter = memoize(function (def, opts) {
  const name = getTypeName({ def, opts });
  const description = def.description;
	const constructor = opts.inputObjectType !== '' ? GraphQLInputObjectType : GraphQLObjectType;
  const fields = getObjectFields(def, opts);

  const type = new constructor({ name, description, fields });
  return type;
}, { serializer: objectTypeSerializer });

const filterOpTypes = ['find', 'delete', 'update'];
// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (def, opts) {
  const { operation = {}, inputObjectType } = opts;
  const { opType, multiple } = operation;
  // This needs to be function, otherwise we run in an infinite recursion, if the children try to reference a parent type
  return () => chain(def.properties)
		.omitBy((childDef, childDefName) => {
      const subDef = getSubDef(childDef);
      // Remove all return value fields for delete operations, except the recursive ones and `id`
      // And except for inputObject, since we use it to get the delete filters
      return (opType === 'delete' && !isModel(subDef) && childDefName !== 'id' && inputObjectType !== 'filter')
        // Create operations do not include data.id
        || (opType === 'create' && childDefName === 'id' && inputObjectType === 'data')
        // Filter inputObjects for single operations only include `id`
        || (filterOpTypes.includes(opType) && childDefName !== 'id' && inputObjectType === 'filter' && !multiple);
    })
    // Model-related fields in input|filter arguments must be simple ids, not recursive definition
    .mapValues(childDef => {
      const subDef = getSubDef(childDef);
      if (!(isModel(subDef) && inputObjectType !== '')) { return childDef; }

      const multiple = childDef.operation.multiple;

      // Retrieves `id` field definition of subfield
      const nonRecursiveAttrs = ['description', 'deprecation_reason'];
      const idDef = Object.assign({}, pick(subDef, nonRecursiveAttrs), omit(subDef.properties.id, nonRecursiveAttrs));

      // Assign `id` field definition to e.g. `model.user`
      const idsDef = multiple ? Object.assign({}, childDef, { items: idDef }) : idDef;

      // Consider this attribute as a normal attribute, not a model anymore
      const subIdsDef = getSubDef(idsDef);
      delete subIdsDef.model;

      return idsDef;
    })
		// Recurse over children
		.mapValues((childDef, childDefName) => {
			// if 'Query' or 'Mutation' objects, pass current operation down to sub-fields, and top-level definition
      const childOperation = childDef.operation || operation;
      const childOpts = Object.assign({}, opts, { operation: childOperation });

      childOpts.isRequired = def.required instanceof Array && def.required.includes(childDefName)
        && canRequireAttributes(childDef, childOpts);

			const field = getField(childDef, childOpts);
      return field;
		})
		.value();
};

const canRequireAttributes = function (def, { operation: { opType } = {}, inputObjectType }) {
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
    condition: (def, opts) => opts.isRequired,
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
