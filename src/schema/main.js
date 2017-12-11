'use strict';

const { reduceAsync } = require('../utilities');

const { reducers } = require('./list');

// Loads schema
const loadSchema = async function ({ runOpts: { schema: path } }) {
  const schemaA = await reduceAsync(
    reducers,
    (schema, func) => func({ schema, path }),
    {},
  );
  return { schema: schemaA };
};

module.exports = {
  loadSchema,
};
