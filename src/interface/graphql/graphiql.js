'use strict';


const { renderGraphiQL } = require('graphql-server-module-graphiql');


const graphiQLHandler = async function () {
  const content = renderGraphiQL({
    endpointURL: 'http://localhost:5001/graphql',
  });
  return {
    type: 'text/html',
    content,
  };
};


module.exports = {
  graphiQLHandler,
};
