'use strict';


// Decides which interface to use (e.g. GraphQL) according to route
const router = function (request) {
  return request.route;
};


module.exports = {
  router,
};