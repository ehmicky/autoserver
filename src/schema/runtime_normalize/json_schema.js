'use strict';

const { mapValues } = require('../../utilities');
const { compile } = require('../../json_validation');

// Compile JSON schema defined in the schema
const compileJsonSchema = function ({
  schema,
  schema: { shortcuts, shortcuts: { validateMap } },
}) {
  const validateMapA = mapValues(
    validateMap,
    jsonSchema => compile({ schema, jsonSchema }),
  );

  return {
    schema: {
      ...schema,
      shortcuts: { ...shortcuts, validateMap: validateMapA },
    },
  };
};

module.exports = {
  compileJsonSchema,
};
