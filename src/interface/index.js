'use strict';


const { router } = require('./router');
const { graphQLHandler, graphiQLHandler } = require('./graphql');


module.exports = {
  router,
  graphql: {
    graphQLHandler,
    graphiQLHandler,
  },
};