'use strict';

const { getRef } = require('../../../json_refs');

// Check for data model inconsistencies, and potentially fix them
const check = function ({ config: { collections }, connection, options }) {
  checkConnection({ connection });

  checkSave({ options });

  Object.keys(collections)
    .forEach(collname => checkCollection({ collname, connection }));
};

const checkConnection = function ({ connection }) {
  if (connection != null && connection.constructor === Object) { return; }

  const message = '\'config.databases.memory.data\' must be an object';
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

const checkSave = function ({ options: { save, data } }) {
  const path = getRef(data);

  if (!save || path !== undefined) { return; }

  const message = '\'config.databases.memory.data\' must be a JSON reference to an object when \'config.databases.memory.save\' is true';
  // eslint-disable-next-line fp/no-throw
  throw new Error(message);
};

const checkCollection = function ({ collname, connection }) {
  if (Array.isArray(connection[collname])) { return; }

  if (connection[collname] !== undefined) {
    const message = `Collection '${collname}' must be either an array of undefined, not ${typeof connection[collname]}`;
    // eslint-disable-next-line fp/no-throw
    throw new Error(message);
  }

  // Add empty collection if missing
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  connection[collname] = [];
};

module.exports = {
  check,
};
