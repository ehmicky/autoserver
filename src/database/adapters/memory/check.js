'use strict';

const { throwError } = require('../../../error');

// Check for data model inconsistencies, and potentially fix them
const check = function ({ schema: { models: schemaModels }, connection }) {
  Object.keys(schemaModels)
    .forEach(modelName => checkCollection({ modelName, connection }));
};

const checkCollection = function ({ modelName, connection }) {
  if (Array.isArray(connection[modelName])) { return; }

  if (connection[modelName] !== undefined) {
    const message = `Collection '${modelName}' must be either an array of undefined, not ${typeof connection[modelName]}`;
    throwError(message, { reason: 'DB_ERROR' });
  }

  // Add empty collection if missing
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  connection[modelName] = [];
};

module.exports = {
  check,
};
