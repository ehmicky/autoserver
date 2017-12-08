'use strict';

const { dereferenceRefs } = require('../json_refs');

const { normalizeSchema } = require('./normalize');

// Load schema, using its path
const loadSchema = async function ({ runOpts: { schema } }) {
  // Resolve JSON references
  const schemaA = await dereferenceRefs({ path: schema });
  // Normalize schema, and validate it
  const schemaB = await normalizeSchema({ schema: schemaA });
  return { schema: schemaB };
};

module.exports = {
  loadSchema,
};
