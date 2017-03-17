'use strict';


const { renderGraphiQL } = require('graphql-server-module-graphiql');


const executeGraphiql = async function () {
  const content = renderGraphiQL({
    endpointURL: 'http://localhost:5001/graphql',
  });
  return {
    type: 'html',
    content,
  };
};


module.exports = {
  executeGraphiql,
};
