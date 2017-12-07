'use strict';

const { dereferenceSchema } = require('../json_refs');

const { normalizeSchema } = require('./normalize');

// Load schema, using its path
const loadSchema = async function ({ runOpts: { schema } }) {
  // Resolve JSON references
  const { rSchema } = await dereferenceSchema({ schema });
  // Normalize schema, and validate it
  const schemaA = await normalize({ schema, rSchema });
  return { schema: schemaA };
};

const normalize = function ({ schema, rSchema }) {
  // One can compile the schema to perform the normalization compile-time
  const isCompiled = schema.endsWith('compiled.json');
  if (isCompiled) { return rSchema; }

  return normalizeSchema({ schema: rSchema });
};

module.exports = {
  loadSchema,
};
