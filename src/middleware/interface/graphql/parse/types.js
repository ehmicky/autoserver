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
const { chain, omit, pick, defaults } = require('lodash');

const { EngineError } = require('../../../../error');
const { recursivePrint } = require('../../../../utilities');
const { getTypeName, getOperationNameFromAttr } = require('./name');
const { getDescription, getDeprecationReason } = require('./description');
const { getResolver } = require('./resolver');
const { isMultiple, getSubDef, getModelName, isModel } = require('./utilities');


// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  return getField(def, opts).type;
};

// Retrieves a GraphQL field info for a given IDL definition, i.e. an object that can be passed to new GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  // Retrieves correct field
  const fieldInfo = graphQLFieldsInfo.find(possibleType => possibleType.condition(def, opts));
  if (!fieldInfo) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${recursivePrint(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }

  // Retrieves field information
  const field = fieldInfo.value(def, opts);

  // The following fields are type-agnostic, so are not inside `fieldInfo.value()`
  // Fields description|deprecation_reason are taken from IDL definition
  const description = getDescription({ def, opType: opts.opType, descriptionType: 'field' });
  const deprecationReason = getDeprecationReason({ def });
  Object.assign(field, defaults({ description, deprecationReason }, field));
	Object.assign(field, getResolver(def, Object.assign({ getType }, opts)));
  Object.assign(field.type, { def });

  // Can only assign default if fields are optional in input, but required by database
  if (canRequireAttributes(def, opts) && !def.required && opts.inputObjectType === 'input' && def.default !== undefined) {
    defaults(field, { defaultValue: def.default });
  }

  return field;
};

// Required field fieldsInfo
const graphQLRequiredFieldsInfo = function (def, opts) {
  // Goal is to avoid infinite recursion, i.e. without modification the same graphQLFieldsInfo would be hit again
  const modifiedDef = Object.assign({}, def, { required: false });
  const subType = getType(modifiedDef, opts);
  const type = new GraphQLNonNull(subType);
  return { type };
};

// Array field fieldsInfo
const graphQLArrayFieldsInfo = function (def, opts) {
  let subDef = getSubDef(def);
  // Underlying model does not get any resolver, only array does
  subDef = Object.assign({} , subDef, { noResolve: true });
  const subType = getType(subDef, opts);
  const type = new GraphQLList(subType);
  return { type };
};

// Done so that children can get a cached reference of parent type, while avoiding infinite recursion
// Only cache schemas that have a model name, because they are the only one that can recurse
// Namespace by operation, because operations can have slightly different types
const memoizeObjectField = function (func) {
  return (def, opts) => {
    const modelName = getModelName(def);
    let key;
    if (modelName) {
      key = `field/${modelName}/${opts.opType}/${opts.inputObjectType || 'generic'}`;
      if (opts.cache.exists(key)) {
        return opts.cache.get(key);
      }
    }

    const fieldInfo = func(def, opts);
    if (key) {
      opts.cache.set(key, fieldInfo);
    }
    return fieldInfo;
  };
};

// Object field fieldsInfo
const graphQLObjectFieldsInfo = memoizeObjectField(function (def, opts) {
  const { inputObjectType, topLevelDef } = opts;
  const name = getTypeName({ def, inputObjectType, topLevelDef });
  const description = getDescription({ def, opType: opts.opType, descriptionType: 'type' });
	const constructor = opts.inputObjectType ? GraphQLInputObjectType : GraphQLObjectType;
  const fields = getObjectFields(def, opts);

  const type = new constructor({ name, description, fields });
  return { type };
});

// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (def, opts) {
  // This needs to be function, otherwise we run in an infinite recursion, if the children try to reference a parent type
  return () => {
		const fields = chain(def.properties)
      // Divide submodels fields between recursive fields (e.g. `model.createUser`) and non-recursive fields
      // (e.g. `model.user`)
      .transform((props, childDef, childDefName) => {
        // Not for 'Query' or 'Mutation' objects, nor models
        if (childDef.opType || !isModel(childDef)) {
          props[childDefName] = childDef;
          return;
        }

        const multiple = isMultiple(childDef);
        const subDef = getSubDef(childDef);

        // Retrieves `id` field definition of subfield
        const nonRecursiveAttrs = ['description', 'deprecation_reason', 'required'];
        const idDef = Object.assign({}, pick(subDef, nonRecursiveAttrs), omit(subDef.properties.id, nonRecursiveAttrs));

        // Assign `id` field definition to e.g. `model.user`
        const idsDef = multiple ? Object.assign({}, childDef, { items: idDef }) : idDef;
        props[childDefName] = idsDef;

        // Assign recursive field to e.g. `model.createUser`
        const newName = getOperationNameFromAttr({ name: childDefName, opType: opts.opType, asPlural: multiple });
        props[newName] = childDef;
      })
      // Remove recursive value fields when used as inputObject (i.e. resolver argument)
      .pickBy(childDef => !(opts.inputObjectType && isModel(childDef)))
			// Remove all return value fields for delete operations, except the recursive ones and `id`
      // And except for inputObject, since we use it to get the delete filters
			.pickBy((childDef, childDefName) => !(
        opts.opType === 'delete' && !isModel(childDef) && childDefName !== 'id' && opts.inputObjectType !== 'filter')
      )
      // `id` is never a data input argument
      .pickBy((_, childDefName) => !(childDefName === 'id' && opts.inputObjectType === 'input'))
			// Recurse over children
			.mapValues(childDef => {
				// if 'Query' or 'Mutation' objects, pass current operation down to sub-fields, and top-level definition
				if (childDef.opType) {
					opts = Object.assign({}, opts, { opType: childDef.opType, topLevelDef: childDef });
				}

				return getField(childDef, opts);
			})
			.value();
    return fields;
  };
};

const canRequireAttributes = function (def, { opType, inputObjectType }) {
  // Update operation does not require any attribute in input object
	return !(opType === 'update' && inputObjectType === 'input')
    // Query inputObjects do not require any attribute
    && inputObjectType !== 'filter';
};

/**
 * Maps an IDL definition into a GraphQL field information, including type
 * The first matching one will be used, i.e. order matters: required modifier, then array modifier come first
 */
const graphQLFieldsInfo = [

	// "Required" modifier type
  {
    condition: (def, opts) => def.required && canRequireAttributes(def, opts),
    value: graphQLRequiredFieldsInfo,
  },

	// "Array" modifier type
  {
    condition: def => def.type === 'array',
    value: graphQLArrayFieldsInfo,
  },

	// "Object" type
  {
    condition: def => def.type === 'object',
    value: graphQLObjectFieldsInfo,
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

	// "ID" type
  {
    condition: def => def.type === 'string' && def.format === 'id',
    value: () => ({ type: GraphQLID }),
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