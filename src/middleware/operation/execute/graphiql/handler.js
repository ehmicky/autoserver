'use strict';


const { host, port } = require('../../../../config');
const { renderGraphiQL } = require('./render');


const executeGraphiql = function () {
  const endpointURL = `http://${host}:${port}/graphql`;

  return async function executeGraphiql(input) {
    const { queryVars, payload = {}, log } = input;
    const perf = log.perf.start('operation.executeGraphiql', 'middleware');

    const {
      query,
      variables,
      operationName,
    } = Object.assign({}, queryVars, payload);

    const content = await renderGraphiQL({
      endpointURL,
      query,
      variables,
      operationName,
    });

    perf.stop();
    return {
      type: 'html',
      content,
    };
  };
};


module.exports = {
  executeGraphiql,
};
