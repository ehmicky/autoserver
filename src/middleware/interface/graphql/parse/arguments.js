'use strict';


const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const { chain } = require('lodash');

const { isMultiple, getSubDef } = require('./utilities');


// Retrieves all resolver arguments, before resolve function is fired
const getArguments = function (def, opts) {
  opts.multiple = isMultiple(def);
	// Builds inputObject types
  const subDef = getSubDef(def);
	const inputObjectOpts = Object.assign({}, opts, { inputObjectType: 'input' });
	opts.inputObjectType = opts.getType(subDef, inputObjectOpts);
	const filterObjectOpts = Object.assign({}, opts, { inputObjectType: 'filter' });
	opts.filterObjectType = opts.getType(subDef, filterObjectOpts);

  return Object.assign(
    {},
		getDataArgument(opts),
		getFilterArgument(opts),
    getOrderArgument(opts)
  );
};

// Add resolver arguments, while resolve function is fired
// As opposed to `getArguments`, those arguments depend on current query resolution, e.g. on parent value
const addArguments = function (def, opts) {
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
const idOnlyFilterOpTypes = ['upsert', 'replace', 'create'];
const optionalIdFilterOpType = ['create'];
const getFilterArgument = function ({ multiple, opType, filterObjectType }) {
  const fields = filterObjectType.getFields();
  const args = chain(fields)
    .mapValues(field => ({
      type: field.type,
      description: field.description,
    }))
    .mapValues((field, fieldName) => {
      if (fieldName === 'id') {
        // Make sure ids are required
        let idType = optionalIdFilterOpType.includes(opType) ? field.type : new GraphQLNonNull(field.type);
        // `id` filter is array (`ids`) instead of *Many
        if (multiple) {
          idType = new GraphQLList(idType);
          // `ids` is required upsertMany, replaceMany and createMany
          if (idOnlyFilterOpTypes.includes(opType) && !optionalIdFilterOpType.includes(opType)) {
            idType = new GraphQLNonNull(idType);
          }
        }
        field.type = idType;
      }
      return field;
    })
    // `id` filter is `ids` instead of *Many
    .mapKeys((_, fieldName) => multiple && fieldName === 'id' ? 'ids' : fieldName)
    // `id` filter is only one for *One
    .pickBy((_, fieldName) => multiple || fieldName === 'id')
    // Only `ids` and `id` are allowed for upsert*, replace* and create*
    .pickBy((_, fieldName) => !(idOnlyFilterOpTypes.includes(opType) && !['id', 'ids'].includes(fieldName)))
    .value();
  return args;
};



module.exports = {
  getArguments,
  addArguments,
};