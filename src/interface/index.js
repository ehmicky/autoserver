'use strict';


const { router } = require('./router');
const { loggingHandler } = require('./logging');
const { graphQLHandler, graphiQLHandler } = require('./graphql');


module.exports = {
  router,
  loggingHandler,
  graphql: {
    graphQLHandler,
    graphiQLHandler,
  },
};