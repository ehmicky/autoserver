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
const { chain } = require('lodash');
const uuidv4 = require('uuid/v4');

const { EngineError } = require('../../../../error');
const { memoize, stringify, omit } = require('../../../../utilities');
const { isJsl } = require('../../../../jsl');
const { getTypeName, getActionName } = require('./name');
const { getSubDef, isModel, isMultiple } = require('./utilities');
const { getArguments } = require('./arguments');


// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts = {}) {
  return getField(def, opts).type;
};

// Retrieves a GraphQL field info for a given IDL definition,
// i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  opts.inputObjectType = opts.inputObjectType || '';

  const fieldGetter = graphQLFieldGetters.find(possibleType => {
    return possibleType.condition(def, opts);
  });
  if (!fieldGetter) {
    const message = `Could not parse property into a GraphQL type: ${stringify(def)}`;
    throw new EngineError(message, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }

  let { type, args } = fieldGetter.value(def, opts);

  // Fields description|deprecation_reason are taken from IDL definition
  const { description, deprecationReason } = def;

	// Only for models, and not for argument types
  // Modifiers (Array and NonNull) retrieve their arguments from
  // underlying type (i.e. `args` is already defined)
  if (isModel(def) && opts.inputObjectType === '' && !args) {
    // Builds types used for `data` and `filter` arguments
    const dataObjectOpts = Object.assign({}, opts, { inputObjectType: 'data' });
    const dataObjectType = getType(def, dataObjectOpts);
    const filterObjectOpts = Object.assign({}, opts, {
      inputObjectType: 'filter',
    });
    const filterObjectType = getType(def, filterObjectOpts);
    // Retrieves arguments
    const argsOpts = Object.assign({}, opts, {
      dataObjectType,
      filterObjectType,
    });
    args = getArguments(def, argsOpts);
  }

  // Can only assign default to input data that is optional.
  // 'update' does not required anything, nor assign defaults
  let defaultValue;
  const hasDefaultValue = !opts.isRequired &&
    opts.inputObjectType === 'data' &&
    opts.action.type !== 'update' &&
    def.default;
  if (hasDefaultValue) {
    // JSL only shows as 'DYNAMIC_VALUE' in schema
    const defaults = def.default instanceof Array ? def.default : [def.default];
    const isDynamic = defaults.some(jsl => {
      return isJsl({ jsl }) || typeof jsl === 'function';
    });
    defaultValue = isDynamic ? 'DYNAMIC_VALUE' : def.default;
  }

  const field = { type, description, deprecationReason, args, defaultValue };
  return field;
};

// Required field FieldGetter
const graphQLRequiredFieldGetter = function (def, opts) {
  // Goal is to avoid infinite recursion,
  // i.e. without modification the same graphQLFieldGetter would be hit again
  opts = Object.assign({}, opts, { isRequired: false });
  const { type: subType, args } = getField(def, opts);
  const type = new GraphQLNonNull(subType);
  return { type, args };
};

// Array field FieldGetter
const graphQLArrayFieldGetter = function (def, opts) {
  const subDef = getSubDef(def);
  const { type: subType, args } = getField(subDef, opts);
  const type = new GraphQLList(subType);
  return { type, args };
};

/**
 * Memoize object type constructor in order to infinite recursion.
 * We use the type name, i.e.:
 *  - type name must differ everytime type might differ
 *  - in particular, at the moment, type name differ when inputObjectType,
 *    action.type or multiple changes
 * We also namespace with a UUID which is unique for each new call to
 * `getSchema()`, to avoid leaking
 **/
const objectTypeSerializer = function ([ def, opts ]) {
  const typeName = getTypeName({ def, opts });
  opts.schemaId = opts.schemaId || uuidv4();
  return `${opts.schemaId}/${typeName}`;
};

// Object field FieldGetter
const graphQLObjectFieldGetter = memoize(function (def, opts) {
  const name = getTypeName({ def, opts });
  const description = def.description;
	const constructor = opts.inputObjectType !== ''
    ? GraphQLInputObjectType
    : GraphQLObjectType;
  const fields = getObjectFields(def, opts);

  const type = new constructor({ name, description, fields });
  return { type };
}, { serializer: objectTypeSerializer });

// Retrieve the fields of an object, using IDL definition
const getObjectFields = function (def, opts) {
  const { action = {}, inputObjectType } = opts;
  // This needs to be function, otherwise we run in an infinite recursion,
  // if the children try to reference a parent type
  return () => {
    const objectFields = chain(def.properties)
      .transform((memo, childDef, childDefName) => {
        const subDef = getSubDef(childDef);

        // Only for nested models
        if (!(isModel(subDef) && !subDef.isTopLevel)) {
          memo[childDefName] = childDef;
          return memo;
        }

        // Copy nested models with a different name that includes the action,
        // e.g. `my_attribute` -> `createMyAttribute`
        // Not for data|filter arguments
        if (inputObjectType === '') {
          const name = getActionName({
            modelName: childDefName,
            action,
            noChange: true,
          });
          memo[name] = childDef;
          // Add transformed name to `required` array,
          // if non-transformed name was present
          const isRequired = def.required instanceof Array &&
            def.required.includes(childDefName) &&
            !def.required.includes(name);
          if (isRequired) {
            def.required.push(name);
          }
        }

        // Nested models use the regular name as well, but as simple ids,
        // not recursive definition
        // Retrieves `id` field definition of subfield
        const nonRecursiveAttrs = [
          'description',
          'deprecation_reason',
          'examples',
        ];
        const recursiveAttrs = ['model', 'type'];
        const idDef = Object.assign(
          {},
          omit(subDef.properties.id, nonRecursiveAttrs),
          omit(subDef, recursiveAttrs)
        );
        // Consider this attribute as a normal attribute, not a model anymore
        delete idDef.model;

        // Assign `id` field definition to e.g. `model.user`
        const idsDef = isMultiple(childDef)
          ? Object.assign({}, childDef, { items: idDef })
          : idDef;
        memo[childDefName] = idsDef;

        return memo;
      })
      .omitBy((childDef, childDefName) => {
        // Filter arguments for single actions only include `id`
        return (
          childDefName !== 'id' &&
          inputObjectType === 'filter' &&
          !action.multiple
        // Nested data arguments do not include `id`
        ) || (
          childDefName === 'id' &&
          inputObjectType === 'data' &&
          !def.isTopLevel
        // Readonly fields cannot be specified as data argument
        ) || (
          inputObjectType === 'data' &&
          childDef.readOnly
        // updateOne|updateMany do not allow data.id
        ) || (
          action.type === 'update' &&
          childDefName === 'id' &&
          inputObjectType === 'data'
        );
      })
      // Recurse over children
      .mapValues((childDef, childDefName) => {
        // if 'Query' or 'Mutation' objects, pass current action down to
        // sub-fields, and top-level definition
        const childAction = childDef.action || action;
        const childOpts = Object.assign({}, opts, { action: childAction });

        childOpts.isRequired = isRequired(
          def,
          childDef,
          childDefName,
          childOpts
        );

        const field = getField(childDef, childOpts);
        return field;
      })
      .value();
    return Object.keys(objectFields).length === 0 ? noAttributes : objectFields;
  };
};

// GraphQL requires every object field to have attributes,
// which does not always makes sense for us.
// So we add this patch this problem by adding this fake attribute
// when the problem arises.
const noAttributes = {
  no_attributes: {
    type: GraphQLString,
    description: `This type does not have any attributes.
This is a dummy attribute.`,
  },
};

// Returns whether a field is required
const isRequired = function (parentDef, def, name, {
  action = {},
  inputObjectType,
}) {
  // Filter inputObjects `id` attribute is always required
  const isFilterId = name === 'id' &&
    inputObjectType === 'filter' &&
    !action.multiple;
  const shouldRequire = isFilterId ||
    // When user declared an attribute as required
    (parentDef.required instanceof Array && parentDef.required.includes(name));
  const shouldNotRequire = (
    // Query inputObjects do not require any attribute,
    // except filter.id for single actions
      inputObjectType === 'filter' &&
      !isFilterId
    // updateOne|updateMany does not require any attribute in input object
    ) || (
      inputObjectType === 'data' &&
      action.type === 'update'
    // data.id is optional in createOne|createMany
    ) || (
      inputObjectType === 'data' &&
      action.type === 'create' &&
      name === 'id'
    );
  return shouldRequire && !shouldNotRequire;
};

/**
 * Maps an IDL definition into a GraphQL field information, including type
 * The first matching one will be used, i.e. order matters:
 * required modifier, then array modifier come first
 */
const graphQLFieldGetters = [

	// "Required" modifier type
  {
    condition: (def, opts) => opts.isRequired,
    value: graphQLRequiredFieldGetter,
  },

	// "Array" modifier type
  {
    condition: def => def.type === 'array',
    value: graphQLArrayFieldGetter,
  },

	// "Object" type
  {
    condition: def => def.type === 'object',
    value: graphQLObjectFieldGetter,
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
    condition: def => def.type === 'string' || def.type === 'null',
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
