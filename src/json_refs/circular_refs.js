'use strict';

const { throwError } = require('../error');

// Validates against recursive references
const validateCircularRefs = function ({ path, paths = [] }) {
  if (!paths.includes(path)) {
    return [...paths, path];
  }

  const message = `The schema cannot contain circular JSON references: '${path}'`;
  throwError(message, { reason: 'SCHEMA_SYNTAX_ERROR' });
};

module.exports = {
  validateCircularRefs,
};
