'use strict';


const { getSwitchMiddleware } = require('../../utilities');
const { executeGraphql } = require('./graphql');
const { executeGraphiql } = require('./graphiql');
const { printGraphql } = require('./graphql_print');


const middlewares = {
  graphql: executeGraphql,
  graphiql: executeGraphiql,
  graphqlprint: printGraphql,
};
const getKey = ({ input: { interface: interf } }) => interf;

// Translates interface-specific calls into generic instance actions
const executeInterface = getSwitchMiddleware({
  middlewares,
  getKey,
  name: 'executeInterface',
});


module.exports = {
  executeInterface,
};
