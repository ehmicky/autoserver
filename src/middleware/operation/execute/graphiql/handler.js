'use strict';


const { renderGraphiQL } = require('./render');


const executeGraphiql = async function (input) {
  const { queryVars, payload = {}, origin, log } = input;
  const perf = log.perf.start('operation.executeGraphiql', 'middleware');

  const endpointURL = `${origin}/graphql`;
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


module.exports = {
  executeGraphiql,
};
