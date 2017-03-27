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


// Retrieves all resolver arguments
const getArguments = function (opts) {
  return Object.assign(
    {},
    getIdArgument(opts),
		getDataArgument(opts),
    getOrderArgument(opts)
  );
};

// id argument, i.e. used for querying|manipulating a single entity
const getIdArgument = function ({ typeOpts: { opType } = {}, multiple, def }) {
  // Only with *One methods, not *Many. Also, not if `data` argument is present, as `data.id` does the same thing
  if (multiple || dataOpTypes.includes(opType)) { return; }

	const description = def.properties && def.properties.id && def.properties.id.description;
  return {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description,
    },
  };
};

// order_by argument, i.e. used for sorting results
const getOrderArgument = function ({ typeOpts: { opType } = {}, multiple }) {
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
const getDataArgument = function ({ multiple, getType, typeOpts, def }) {
	// Only for mutation operations, but not delete
	if (!dataOpTypes.includes(typeOpts.opType)) { return; }

	// Builds inputObject type
	const inputObjectOpts = Object.assign({}, typeOpts, { isInputObject: true });
	let inputObjectType = getType(def, inputObjectOpts);

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
const getFilterArgument = function ({ multiple }) {
  // Only with *Many methods, not *One
	if (!multiple) { return; }
};


module.exports = {
  getArguments,
};