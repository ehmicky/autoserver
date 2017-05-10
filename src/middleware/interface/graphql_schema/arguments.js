'use strict';


const {
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');


// Retrieves all resolver arguments, before resolve function is fired
const getArguments = function (def, opts) {
  return Object.assign(
    {},
		getDataArgument(opts),
		getFilterArgument(def, opts),
    getOrderArgument(opts),
    getPaginationArguments(opts),
    getDryRunArguments(opts)
  );
};

// Data argument, i.e. payload used by mutation actions
const dataActionTypes = ['create', 'upsert', 'replace', 'update'];
const multipleDataActionTypes = ['create', 'upsert', 'replace'];
const getDataArgument = function ({ action: { actionType, multiple } = {}, dataObjectType }) {
	// Only for mutation actions, but not delete
	if (!dataActionTypes.includes(actionType)) { return; }

	// Retrieves description before wrapping in modifers
	const description = dataObjectType.description;

	// Add required and array modifiers
	dataObjectType = new GraphQLNonNull(dataObjectType);
  // Only multiple with createMany or upsertMany or replaceMany
	if (multiple && multipleDataActionTypes.includes(actionType)) {
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
const filterActionTypes = ['find', 'delete', 'update'];
const getFilterArgument = function (def, { action: { actionType, multiple } = {}, filterObjectType }) {
  // Nested queries for findOne|deleteOne|updateOne do not use filters, as it is implied from parent return value
  if (!filterActionTypes.includes(actionType) || (!def.isTopLevel && !multiple)) { return; }
  const type = multiple ? filterObjectType : new GraphQLNonNull(filterObjectType);
  return {
    filter: {
      type,
      description: 'Filter results according to those attributes',
    },
  };
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

// Pagination arguments
const paginationActionTypes = ['find'];
const getPaginationArguments = function ({ action: { actionType, multiple }, defaultPageSize, maxPageSize }) {
  // Only with safe operations that return an array, i.e. only with findMany
  if (!(paginationActionTypes.includes(actionType) && multiple)) { return; }

  return {
    page_size: {
      type: GraphQLInt,
      description: `Sets pagination size.
Using 0 disables pagination.
Maximum: ${maxPageSize}`,
      defaultValue: defaultPageSize,
    },

    after: {
      type: GraphQLString,
      description: 'Retrieves next pagination batch, using the previous response\'s \'next_token\'',
    },

    before: {
      type: GraphQLString,
      description: 'Retrieves previous pagination batch, using the previous response\'s \'previous_token\'',
    },

    pagination_info: {
      type: GraphQLBoolean,
      description: `Adds extra pagination information in the output, related to the first page, the last page and the total response size.
This will slightly slow down the request.`,
      defaultValue: false,
    },
  };
};

// dry_run argument
const mutationActionTypes = ['delete', 'update', 'create', 'upsert', 'replace'];
const getDryRunArguments = function ({ action: { actionType } }) {
  // Only with *Many actions
  if (!mutationActionTypes.includes(actionType)) { return; }

  return {
    dry_run: {
      type: GraphQLBoolean,
      description: `If true, the action will not modify the database.
The return value will remain the same.`,
      defaultValue: false,
    },
  };
};


module.exports = {
  getArguments,
};
