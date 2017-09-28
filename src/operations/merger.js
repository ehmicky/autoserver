'use strict';

const { assignObject } = require('../utilities');

const handlers = require('./handlers');

// Return object of all operation-specific methods, as { OPERATION: OBJECT }
// Everything that is operation-specific is in this directory.
// E.g. there should be no GraphQL-related code outside of this directory,
// to enforce operation-agnosticism and separation of concerns.
const getOperationsHandlers = function () {
  return Object.values(handlers)
    .map(handler => ({ [handler.name]: handler }))
    .reduce(assignObject, {});
};

const operationHandlers = getOperationsHandlers();

module.exports = {
  operationHandlers,
};
