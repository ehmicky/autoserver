'use strict';


const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');
const { chain } = require('lodash');


// Retrieves all resolver arguments
const getArguments = function (opts) {
  return Object.assign(
    {},
		getDataArgument(opts),
		getFilterArgument(opts),
    getOrderArgument(opts)
  );
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
    // `id` filter is required for findOne and deleteOne
    .mapValues((field, fieldName) => {
      if (fieldName === 'id' && !multiple) {
        field.type = new GraphQLNonNull(field.type);
      }
      return field;
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


module.exports = {
  getArguments,
};