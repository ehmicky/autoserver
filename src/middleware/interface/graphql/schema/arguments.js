'use strict';


const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');


// Retrieves all resolver arguments, before resolve function is fired
const getArguments = function (def, opts) {
  return Object.assign(
    {},
		getDataArgument(opts),
		getFilterArgument(def, opts),
    getOrderArgument(opts)
  );
};

// order_by argument, i.e. used for sorting results
const getOrderArgument = function ({ action: { multiple } }) {
  // Only with *Many actions
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

// Data argument, i.e. payload used by mutation actions
const dataOpTypes = ['create', 'upsert', 'replace', 'update'];
const multipleDataOpTypes = ['create', 'upsert', 'replace'];
const getDataArgument = function ({ action: { opType, multiple } = {}, dataObjectType }) {
	// Only for mutation actions, but not delete
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
const getFilterArgument = function (def, { action: { opType, multiple } = {}, filterObjectType }) {
  // Nested queries for findOne|deleteOne|updateOne do not use filters, as it is implied from parent return value
  if (!filterOpTypes.includes(opType) || (!def.isTopLevel && !multiple)) { return; }
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
