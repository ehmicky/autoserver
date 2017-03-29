'use strict';


const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const { chain } = require('lodash');

const { getReverseIdName } = require('./name');
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
  addReverseIdArgument(def, opts);
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
  // Only with find*, delete* or update*
	if (!filterOpTypes.includes(opType)) { return; }
  const fields = filterObjectType.getFields();
  const args = chain(fields)
    .mapValues(field => ({
      type: field.type,
      description: field.description,
    }))
    .mapValues((field, fieldName) => {
      if (fieldName === 'id') {
        // Make sure ids are required
        const idType = new GraphQLNonNull(field.type);
        // `id` filter is array instead of *Many
        if (multiple) {
          field.type = new GraphQLList(idType);
        } else {
          field.type = idType;
        }
      }
      return field;
    })
    // `id` filter is `ids` instead of *Many
    .mapKeys((_, fieldName) => {
      if (multiple && fieldName === 'id') {
        return 'ids';
      }
      return fieldName;
    })
    .pickBy((_, fieldName) => {
      // `id` filter is excluded from *Many
      if (multiple) {
        return fieldName !== 'id';
      // `id` filter is the only one for *Many
      } else {
        return fieldName === 'id';
      }
    })
    .value();
  return args;
};

// Add reverse id information to sub-models
const addReverseIdArgument = function (def, { args, opType, parent }) {
  const reverseIdVal = parent.val.id;
  // Top-level models do not add reverse id information
  if (!reverseIdVal) { return; }

  const reverseIdName = getReverseIdName({ def, parentDef: parent.def });
  const parentArg = { [reverseIdName]: reverseIdVal };

  // If there is args.data, add reverse_id to each data object
  if (dataOpTypes.includes(opType)) {
    if (args.data instanceof Array) {
      args.data = args.data.map(data => Object.assign(data, parentArg));
    } else {
      Object.assign(args.data, parentArg);
    }
  }
  // If there are query filters, add reverse_id to each filter object
  if (filterOpTypes.includes(opType)) {
    Object.assign(args, parentArg);
  }
};


module.exports = {
  getArguments,
  addArguments,
};