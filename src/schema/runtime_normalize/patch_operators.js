'use strict';

const { OPERATORS } = require('../../patch');

// Merge system patch operators and schema-defined ones
const normalizePatchOperators = function ({ schema, schema: { operators } }) {
  if (operators === undefined) { return; }

  const operatorsA = { ...operators, ...OPERATORS };

  return { schema: { ...schema, operators: operatorsA } };
};

module.exports = {
  normalizePatchOperators,
};
