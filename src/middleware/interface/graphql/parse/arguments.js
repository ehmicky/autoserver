'use strict';


const {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
} = require('graphql');


/*
ATTR {any}: filtering
  - for *Many
	- including description
Default values (only if not required)
*/

/*
findOne
findMany
createOne
createMany
replaceOne
replaceMany
updateOne
updateMany
upsertOne
upsertMany
deleteOne
deleteMany
*/


const getArguments = function (opts) {
  return Object.assign(
    {},
    getIdArgument(opts),
		getDataArgument(opts),
    getOrderArgument(opts)
  );
};

// id argument, i.e. used for querying|manipulating a single entity
const getIdArgument = function ({ prefix, multiple, def }) {
  // Only with *One methods, not *Many. Also, not if `data` argument is present, as `data.id` does the same thing
  if (multiple || dataOperations.includes(prefix)) { return; }
	const description = def.properties && def.properties.id && def.properties.id.description;
  return {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description,
    },
  };
};

// order_by argument, i.e. used for sorting results
const getOrderArgument = function ({ prefix, multiple }) {
  // Only with *Many methods, except DeleteMany (since it does not return anything)
  if (!multiple || prefix === 'delete') { return; }
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
const dataOperations = ['create', 'replace', 'update', 'upsert'];
const getDataArgument = function ({ inputObjectType, prefix, multiple }) {
	// Only for mutation operations, but not delete
	if (!dataOperations.includes(prefix)) { return; }
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


module.exports = {
  getArguments,
};