'use strict';


const { GraphQLNonNull } = require('graphql');


// Filters argument, i.e. only queries entities that match specified attributes
const filterActionTypes = ['find', 'delete', 'update'];
const getFilterArgument = function ({ def, action: { actionType, multiple } = {}, filterObjectType }) {
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


module.exports = {
  getFilterArgument,
};
