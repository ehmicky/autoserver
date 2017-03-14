'use strict';


const { renderGraphiQL } = require('graphql-server-module-graphiql');


const handleGraphiQL = async function () {
  const content = renderGraphiQL({
    endpointURL: 'http://localhost:5001/graphql',
  });
  return {
    type: 'text/html',
    content,
  };
};
handleGraphiQL.condition = function (request) {
  return request.route === 'GraphiQL';
};


module.exports = {
  handleGraphiQL,
};
