'use strict';

const { deepMerge } = require('../../../utilities');
const { dereferenceRefs } = require('../../../json_refs');

const { getEnvVars } = require('./env');
const { getConfPath } = require('./path');

// Load schema file
const loadFile = async function ({ schemaPath, schema: schemaOpts }) {
  const { config: envSchemaPath, ...envVars } = getEnvVars();

  const path = await getConfPath({ envSchemaPath, schemaPath });

  const schemaFile = await dereferenceRefs({ path });

  // Priority order: environment variables > Node.js/CLI options > schema file
  const schema = deepMerge(schemaFile, schemaOpts, envVars);

  return schema;
};

module.exports = {
  loadFile,
};
