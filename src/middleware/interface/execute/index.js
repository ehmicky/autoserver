'use strict';


const { mapAsync } = require('../../../utilities');
const { executeGraphql } = require('./graphql');
const { executeGraphiql } = require('./graphiql');
const { printGraphql } = require('./graphql_print');


// Translates interface-specific calls into generic instance actions
const interfaceExecute = async function (opts) {
  const { startupLog } = opts;
  const mdws = await mapAsync(middlewares, async (mdw, name) => {
    const perf = startupLog.perf.start(`interface.${name}`, 'middleware');
    mdw = await mdw(opts);
    perf.stop();
    return mdw;
  });

  return async function interfaceExecute(input) {
    const response = await mdws[input.interface].call(this, input);
    return response;
  };
};

const middlewares = {
  GraphQL: executeGraphql,
  GraphiQL: executeGraphiql,
  GraphQLPrint: printGraphql,
};


module.exports = {
  interfaceExecute,
};
