'use strict';


const { mapAsync } = require('../../../utilities');
const { executeGraphql } = require('./graphql');
const { executeGraphiql } = require('./graphiql');
const { printGraphql } = require('./graphql_print');


// Translates operation-specific calls into generic instance actions
const operationExecute = async function (opts) {
  const { startupLog } = opts;
  const mdws = await mapAsync(middlewares, async (mdw, name) => {
    const perf = startupLog.perf.start(`operation.${name}`, 'middleware');
    mdw = await mdw(opts);
    perf.stop();
    return mdw;
  });

  return async function operationExecute(input) {
    const response = await mdws[input.operation].call(this, input);
    return response;
  };
};

const middlewares = {
  GraphQL: executeGraphql,
  GraphiQL: executeGraphiql,
  GraphQLPrint: printGraphql,
};


module.exports = {
  operationExecute,
};
