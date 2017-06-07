'use strict';


const { mapAsync } = require('../../../utilities');
const { executeGraphql } = require('./graphql');
const { executeGraphiql } = require('./graphiql');
const { printGraphql } = require('./graphql_print');


// Translates interface-specific calls into generic instance actions
const interfaceExecute = async function (opts) {
  const mdws = await mapAsync(middlewares, async mdw => await mdw(opts));

  return async function interfaceExecute(input) {
    return await mdws[input.interface].call(this, input);
  };
};

const middlewares = {
  graphql: executeGraphql,
  graphiql: executeGraphiql,
  graphqlprint: printGraphql,
};


module.exports = {
  interfaceExecute,
};
