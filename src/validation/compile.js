'use strict';

const { memoize } = require('../utilities');

const { getValidator } = require('./validator');
const { getCustomValidator } = require('./custom_validator');

const compile = function ({ idl, schema }) {
  const validator = idl ? getCustomValidator({ idl }) : getValidator();
  const compiledSchema = validator.compile(schema);
  return compiledSchema;
};

// We do not want to recompile the same schema several times.
// But we do want the recompile if `idl` was passed or not,
// targetting custom validator or not
const mCompile = memoize(compile, {
  serializer: ({ idl, schema }) =>
    `${idl === undefined} ${JSON.stringify(schema)}`,
});

module.exports = {
  compile: mCompile,
};
