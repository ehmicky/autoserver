'use strict';


const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');


// Retrieves all resolver arguments, before resolve function is fired
const getArguments = function (def, opts) {
	// Builds inputObject types
  const multiple = opts.operation.multiple;
	const dataObjectOpts = Object.assign({}, opts, { inputObjectType: 'data' });
	const dataObjectType = opts.getType(def, dataObjectOpts);
	const filterObjectOpts = Object.assign({}, opts, { inputObjectType: 'filter' });
  const filterObjectType = opts.getType(def, filterObjectOpts);

  opts = Object.assign({}, opts, {
    multiple,
    dataObjectType,
    filterObjectType,
  });

  const args = Object.assign(
    {},
		getDataArgument(opts),
		getFilterArgument(opts),
    getOrderArgument(opts)
  );
  return args;
};

// order_by argument, i.e. used for sorting results
const getOrderArgument = function ({ multiple }) {
  // Only with *Many methods
  if (!multiple) { return; }

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
const getDataArgument = function ({ multiple, operation: { opType } = {}, dataObjectType }) {
	// Only for mutation operations, but not delete
	if (!dataOpTypes.includes(opType)) { return; }

	// Retrieves description before wrapping in modifers
	const description = dataObjectType.description;

	// Add required and array modifiers
	dataObjectType = new GraphQLNonNull(dataObjectType);
  // Only multiple with createMany or upsertMany or replaceMany
	if (multiple && multipleDataOpTypes.includes(opType)) {
		dataObjectType = new GraphQLNonNull(new GraphQLList(dataObjectType));
	}

	return {
		data: {
			type: dataObjectType,
			description,
		},
	};
};

// Filters argument, i.e. only queries entities that match specified attributes
const filterOpTypes = ['find', 'delete', 'update'];
const getFilterArgument = function ({ multiple, operation: { opType } = {}, filterObjectType }) {
  if (!filterOpTypes.includes(opType)) { return; }
  const type = multiple ? filterObjectType : new GraphQLNonNull(filterObjectType);
  return {
    filter: {
      type,
      description: 'Filter results according to those attributes',
    },
  };
};


module.exports = {
  getArguments,
};
