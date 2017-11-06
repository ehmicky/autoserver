'use strict';

const { throwError } = require('../../../error');

// Check for data model inconsistencies, and potentially fix them
const check = function ({ schema: { models: schemaModels }, connection }) {
  Object.keys(schemaModels)
    .forEach(modelname => checkCollection({ modelname, connection }));
};

const checkCollection = function ({ modelname, connection }) {
  if (Array.isArray(connection[modelname])) { return; }

  if (connection[modelname] !== undefined) {
    const message = `Collection '${modelname}' must be either an array of undefined, not ${typeof connection[modelname]}`;
    throwError(message, { reason: 'DB_ERROR' });
  }

  // Add empty collection if missing
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  connection[modelname] = [];
};

module.exports = {
  check,
};
