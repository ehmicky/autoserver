'use strict';


const {
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');


/*
id {ID}:
  - for *One (required)
order_by {string}: 'ATTR[+|-]'
  - for *Many, except deleteMany
  - default value: 'id+'
ATTR {any}: filtering
  - for *Many
data {InputObject|InputObject[]}:
  - for create|replace|update|upsert*
  - Array if *Many
  - uses default values as defined in schema.default, except if required
  - uses required values as defined in schema.required, if create|replace|upsert
  - does not include ID, same attributes otherwise (including submodels?)
  - no resolver
  - default value: {}
Argument descriptions:
  - hardcoded for order_by or ATTR
  - uses same description as Object for InputObject, and for id (with default)
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
    getOrderArgument(opts)
  );
};

// id argument, i.e. used for querying|manipulating a single entity
const getIdArgument = function ({ multiple }) {
  // Only with *One methods, not *Many
  if (multiple) { return; }
  return {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Entity identifier',
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
Sort in ascending or descending order by appending + or - (default is ascending)`,
      defaultValue: 'id+',
    },
  };
};


module.exports = {
  getArguments,
};