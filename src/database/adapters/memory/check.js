'use strict';

const { throwError } = require('../../../error');

// Check for data model inconsistencies, and potentially fix them
const check = function ({ schema: { collections }, connection }) {
  Object.keys(collections)
    .forEach(collname => checkCollection({ collname, connection }));
};

const checkCollection = function ({ collname, connection }) {
  if (Array.isArray(connection[collname])) { return; }

  if (connection[collname] !== undefined) {
    const message = `Collection '${collname}' must be either an array of undefined, not ${typeof connection[collname]}`;
    throwError(message, { reason: 'DB_ERROR' });
  }

  // Add empty collection if missing
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  connection[collname] = [];
};

module.exports = {
  check,
};
