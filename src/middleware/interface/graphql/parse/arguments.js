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
	// Builds inputObject type
  const subDef = getSubDef(def);
	const inputObjectOpts = Object.assign({}, opts, { isInputObject: true });
	opts.inputObjectType = opts.getType(subDef, inputObjectOpts);

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
const dataOpTypes = ['create', 'replace', 'update', 'upsert'];
const getDataArgument = function ({ multiple, opType, inputObjectType }) {
	// Only for mutation operations, but not delete
	if (!dataOpTypes.includes(opType)) { return; }

	// Retrieves description before wrapping in modifers
	const description = inputObjectType.description;

	// Add required and array modifiers
	inputObjectType = new GraphQLNonNull(inputObjectType);
	if (multiple) {
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
const filterOpTypes = ['find', 'delete'];
const getFilterArgument = function ({ multiple, opType, inputObjectType }) {
  // Only with find* and delete*
	if (!filterOpTypes.includes(opType)) { return; }
  const fields = inputObjectType.getFields();
  const args = chain(fields)
    .mapValues(field => ({
      type: field.type,
      description: field.description,
    }))
    .mapValues((field, fieldName) => {
      if (fieldName === 'id') {
        // `id` filter is array instead of findMany and deleteMany
        if (multiple) {
          field.type = new GraphQLList(new GraphQLNonNull(field.type));
        // `id` filter is required for findOne and deleteOne
        } else {
          field.type = new GraphQLNonNull(field.type);
        }
      }
      return field;
    })
    // `id` filter is `ids` instead of findMany and deleteMany
    .mapKeys((_, fieldName) => {
      if (multiple && fieldName === 'id') {
        return 'ids';
      }
      return fieldName;
    })
    .pickBy((_, fieldName) => {
      // `id` filter is excluded from findMany, deleteMany
      if (multiple) {
        return fieldName !== 'id';
      // `id` filter is the only one for findMany, deleteMany
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