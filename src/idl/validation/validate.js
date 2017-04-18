'use strict';


const { merge, each } = require('lodash');
const yaml = require('js-yaml');

const { validate, memoize, fs: { readFileAsync } } = require('../../utilities');
const { EngineError } = require('../../error');
const IDL_SCHEMA_PATH = './src/idl/validation/idl_schema.yml';


// Validate IDL definition against a JSON schema
const validateIdl = async function (idl) {
  const schema = await getSchema();
  const idlCopy = getIdlCopy(idl);
  validateCircularRefs({ value: idl });
  validate({ schema, data: idlCopy, reportInfo: { type: 'idl', dataVar: 'config' } });
};

// Adds some temporary property on IDL, to help validation
const getIdlCopy = function (idl) {
  const modelNames = Object.keys(idl.models);
  return merge({}, idl, { modelNames });
};

// Retrieve IDL schema
const getSchema = memoize(async function () {
  const schemaContent = await readFileAsync(IDL_SCHEMA_PATH);
  const schema = yaml.load(schemaContent, { schema: yaml.CORE_SCHEMA, json: true });
  return schema;
});

/**
 * There should be no circular references.
 * They may be introduced by e.g. dereferencing JSON references `$ref` or YAML anchors `*var`
 * The only legal way to introduce circular references is by using `model` property, which is dereferenced later.
 **/
 const validateCircularRefs = function ({ value, path = 'schema', pathSet = new WeakSet() }) {
  if (pathSet.has(value)) {
    throw new EngineError(`Schema cannot contain circular references: ${path}`, { reason: 'IDL_VALIDATION' });
  }
  if (typeof value === 'object') {
    pathSet.add(value);
  }

  // Recursion
  if (!value || !(value instanceof Array || value.constructor === Object)) { return; }
  each(value, (child, childKey) => {
    const pathPart = value instanceof Array ? `[${childKey}]` : `.${childKey}`;
    const childPath = `${path}${pathPart}`;
    validateCircularRefs({ value: child, path: childPath, pathSet });
  });
};


module.exports = {
  validateIdl,
};
