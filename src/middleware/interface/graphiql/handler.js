'use strict';


const { renderGraphiQL } = require('./render');
const { host, port } = require('../../../config');


const executeGraphiql = async function () {
  return async function (request) {
    const { params = {}, payload = {} } = request;
    const query = params.query || payload.query;
    const variables = params.variables || payload.variables;
    const operationName = params.operationName || payload.operationName;
    const endpointURL = `http://${host}:${port}/graphql`;

    const content = await renderGraphiQL({
      endpointURL,
      query,
      variables,
      operationName,
    });
    return {
      type: 'html',
      content,
    };
  };
};


module.exports = {
  executeGraphiql,
};