'use strict';


const { renderGraphiQL } = require('graphql-server-module-graphiql');


const handleGraphiQL = async function graphiQLHandler() {
  const content = renderGraphiQL({
    endpointURL: 'http://localhost:5001/graphql',
  });
  return {
    type: 'text/html',
    content,
  };
};


module.exports = {
  handleGraphiQL,
};
