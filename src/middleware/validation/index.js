'use strict';


const { chain, merge } = require('lodash');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, errorDataPath: 'property', jsonPointers: true, full: true, $data: true });
// Add future JSON standard keywords
require('ajv-keywords')(ajv, [ 'if', 'formatMinimum', 'formatMaximum', 'deepRequired', 'deepProperties', ]);

const { EngineError } = require('../../error');


const validation = async function ({ idl }) {
  return async function (input) {
    const { modelName, args, operation } = input;
    const attributes = getAttributes(args);
    const schema = idl.models[modelName];
    attributes.forEach(attrs => {
      const transformedSchema = transformSchema({ schema, operation });
      validate({ schema: transformedSchema, attrs });
    });

    const response = await this.next(input);
    return response;
  };
};

// Transform arguments into model attributes to validate
const keySymbol = Symbol('key');
const getAttributes = function (args) {
  return chain(args)
    .pickBy((value, key) => value && normalizeAttributes[key])
    .map((value, key) => {
      const normalizedAttr = normalizeAttributes[key](value);
      const attrs = normalizedAttr instanceof Array ? normalizedAttr : [normalizedAttr];
      const labeledAttrs = attrs.map(attr => Object.assign({}, attr, { [keySymbol]: key }));
      return labeledAttrs;
    })
    .flatten()
    .value();
};

const normalizeAttributes = {
  data: data => data,
  filters: filters => filters,
  ids: ids => ids.map(id => ({ id })),
  id: id => ({ id }),
};

const validate = function ({ schema, attrs }) {
  const validateFunc = ajv.compile(schema);
  const isValid = validateFunc(attrs);
  if (!isValid) {
    const dataVar = attrs[keySymbol];
    const errorText = ajv.errorsText(validateFunc.errors, { separator: '\n', dataVar });
    throw new EngineError(errorText, { reason: 'INPUT_VALIDATION' });
  }
};

/*
REQUIRE:
Use schema.yml require array except:
  data.id[s]: only update|replace|upsert or findOne|deleteOne
  data.ATTR: only create|replace|upsert
  return.id[s]: always
  return.ATTR: not delete
*/
const optionalIdOperations = ['findMany', 'deleteMany', 'createOne', 'createMany'];
const optionalAttrOperations = ['updateOne', 'updateMany', 'findOne', 'findMany', 'deleteOne', 'deleteMany'];
const transformSchema = function ({ schema, operation }) {
  // Deep copy
  schema = merge({}, schema);
  if (schema.required instanceof Array) {
    // Some operations do not require `id`
    if (optionalIdOperations.includes(operation)) {
      schema.required = schema.required.filter(requiredProp => requiredProp !== 'id');
    }
    // Some operations do not require normal attributes (except for `id`)
    if (optionalAttrOperations.includes(operation)) {
      schema.required = schema.required.filter(requiredProp => requiredProp === 'id');
    }
  }
  return schema;
};


module.exports = {
  validation,
};
