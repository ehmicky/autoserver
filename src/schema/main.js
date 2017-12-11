'use strict';

const { reduceAsync } = require('../utilities');

const { reducers } = require('./list');

// Loads schema
const loadSchema = async function ({ runOpts: { schema } }) {
  const schemaB = await reduceAsync(
    reducers,
    (schemaA, func) => func({ schema: schemaA }),
    schema,
  );
  return { schema: schemaB };
};

module.exports = {
  loadSchema,
};
