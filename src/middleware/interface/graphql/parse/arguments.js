'use strict';


const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const { chain, mapValues, pickBy, intersection } = require('lodash');

const { isMultiple, getSubDef } = require('./utilities');


/**
 * Summary of arguments:
 *  - {any|any[]} id|ids     - Filter the operation by id
 *                             For createOne:
 *                              - it is the id the newly created instance
 *                              - it is optional, unless there is another nested operation on a submodel
 *                             Operations on submodels will automatically get filtered by id.
 *                             If an id is then specified, both filters will be used
 *  - {object|object[]} data - Attributes to update or create
 *                             Is an array with createMany, replaceMany or upsertMany
 *  - {any} filter           - Filter the operation by a specific attribute.
 *                             The argument name is that attribute name, not `filter`
 *  - {string} order_by      - Sort results.
 *                             Value is attribute name, followed by optional + or - for ascending|descending order (default: +)
 *
 * Summary of operations:
 *   findOne(id)
 *   findMany([filter...])
 *   deleteOne(id)
 *   deleteMany([filter...])
 *   updateOne(data, id)
 *   updateMany(data[, filter...])
 *   createOne(data[, id])
 *   createMany(data[][, ids])
 *   replaceOne(data, id)
 *   replaceMany(data[], ids)
 *   upsertOne(data, id)
 *   upsertMany(data[], ids)
 **/


// Retrieves all resolver arguments, before resolve function is fired
const getArguments = function (def, opts) {
	// Builds inputObject types
  const subDef = getSubDef(def);
	const inputObjectOpts = Object.assign({}, opts, { inputObjectType: 'input' });
	const inputObjectType = opts.getType(subDef, inputObjectOpts);
	const filterObjectOpts = Object.assign({}, opts, { inputObjectType: 'filter' });
  const filterObjectType = opts.getType(subDef, filterObjectOpts);

  opts = Object.assign({}, opts, {
    multiple: isMultiple(def),
    isTopLevel: def.isTopLevel,
    inputObjectType,
    filterObjectType,
  });

  const args = Object.assign(
    {},
    getIdArgument(opts),
		getDataArgument(opts),
		getFilterArgument(opts),
    getOrderArgument(opts)
  );
  return args;
};

// Add resolver arguments, while resolve function is fired
// As opposed to `getArguments`, those arguments depend on current query resolution, e.g. on parent value
const addArguments = function (def, { args, multiple, parent }) {
  return [
    addNestedIdArguments,
  // Each function can return a value, i.e. database will not be queried, and that return value will be used instead
  ].find(func => func(def, { args, multiple, parent }));
};

// order_by argument, i.e. used for sorting results
const getOrderArgument = function ({ opType, multiple }) {
  // Only with *Many methods, except DeleteMany (since it does not return anything)
  if (!multiple || opType === 'delete') { return; }

  return {
    order_by: {
      type: GraphQLString,
      description: `Sort results according to this attribute.
Specify ascending or descending order by appending + or - (default is ascending)`,
      defaultValue: 'id+',
    },
  };
};

// Data argument, i.e. payload used by mutation operations
const dataOpTypes = ['create', 'upsert', 'replace', 'update'];
const multipleDataOpTypes = ['create', 'upsert', 'replace'];
const getDataArgument = function ({ multiple, opType, inputObjectType }) {
	// Only for mutation operations, but not delete
	if (!dataOpTypes.includes(opType)) { return; }

	// Retrieves description before wrapping in modifers
	const description = inputObjectType.description;

	// Add required and array modifiers
	inputObjectType = new GraphQLNonNull(inputObjectType);
  // Only multiple with createMany or upsertMany or replaceMany
	if (multiple && multipleDataOpTypes.includes(opType)) {
		inputObjectType = new GraphQLNonNull(new GraphQLList(inputObjectType));
	}

	return {
		data: {
			type: inputObjectType,
			description,
		},
	};
};

// Filters argument, i.e. only queries entities that match specified attributes
const filterOpTypes = ['find', 'delete', 'update'];
const getFilterArgument = function ({ multiple, opType, filterObjectType }) {
  const fieldsArgs = getFieldsArgs({ filterObjectType });
  // Only for findMany, deleteMany and updateMany
  if (!multiple || !filterOpTypes.includes(opType)) { return; }
  // Exclude `id` argument, as it handled by getIdArgument()
  const filterIdArgs = pickBy(fieldsArgs, (_, fieldName) => fieldName !== 'id');
  return filterIdArgs;
};

// id argument, used to query, and (with create|replace|upsert) also mutate
const optionalIdOpTypes = ['create'];
const getIdArgument = function ({ multiple, opType, filterObjectType, isTopLevel }) {
  // Nested types do not get id argument, as it is guessed from parent value
  // Exception: findMany, deleteMany and updateMany, where it is merged (intersected) with parent value
  if (!isTopLevel && !(multiple && filterOpTypes.includes(opType))) { return; }

  const fieldsArgs = getFieldsArgs({ filterObjectType });
  const dataIdArgs = chain(fieldsArgs)
    .pickBy((_, fieldName) => fieldName === 'id')
    .mapValues(field => {
      let idType = field.type;
      // createOne and createMany do not require ids
      const isOptional = optionalIdOpTypes.includes(opType)
      // nor can findMany, deleteMany or updateMany (since it is used as an optional filter)
        || (filterOpTypes.includes(opType) && multiple);
      if (!isOptional) {
        idType = new GraphQLNonNull(idType);
      }
      if (multiple) {
        idType = new GraphQLList(idType);
        if (!isOptional) {
          idType = new GraphQLNonNull(idType);
        }
      }
      field.type = idType;
      return field;
    })
    // `id` argument is `ids` instead in *Many operations
    .mapKeys(() => multiple ? 'ids' : 'id')
    .value();
  return dataIdArgs;
};

// Retrieve model fields, so they can be used as arguments
const getFieldsArgs = function ({ filterObjectType }) {
  const fields = filterObjectType.getFields();
  return mapValues(fields, field => ({
    type: field.type,
    description: field.description,
  }));
};

/**
 * Make nested models filtered by their parent model
 * E.g. if a model findParent() returns { child: 1 }, then a nested query findChild() will be filtered by `id: 1`
 * If the parent returns nothing|null, the nested query won't be performed and null will be returned
 *  - this means when performing a nested `create`, the parent must specify the id of its non-created-yet children
 * Will add `id` argument for *One operations, `ids` for *Many operations
 */
const addNestedIdArguments = function (def, { args, multiple, parent }) {
  // Only for nested models
  if (def.isTopLevel) { return; }

  const parentVal = parent.val[def.title];
  if (multiple) {
    // Make sure parent value is defined and correct
    if (parentVal == null || !(parentVal instanceof Array) || parentVal.length === 0) { return []; }
    // If `ids` filter is specified by client, intersects with it
    if (args.ids && args.ids instanceof Array) {
      args.ids = intersection(args.ids, parentVal);
    } else {
      // Add `ids` filter
      args.ids = parentVal;
    }
  } else {
    // Make sure parent value is defined and correct
    if (parentVal == null || parentVal === '') { return null; }
    // Add `id` filter
    args.id = parentVal;
  }
};



module.exports = {
  getArguments,
  addArguments,
};