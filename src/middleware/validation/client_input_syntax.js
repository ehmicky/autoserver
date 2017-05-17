'use strict';


const { set, merge, mergeWith } = require('lodash');

const { validate } = require('../../validation');
const { jslRegExp } = require('../../jsl');


/**
 * Check API input, for client-side errors (e.g. 400)
 * Only checks basic input according to current command.name
 * In a nutshell, checks that:
 *  - required attributes are defined
 *  - disabled attributes are not defined
 *  - `filter` is an object, `data` is an array or object
 *    (depending on command.name)
 *  - `order_by` and `dry_run` syntax looks valid
 *    (does not check whether it is semantically correct)
 **/
const validateClientInputSyntax = function ({
  modelName,
  action,
  command,
  args,
}) {
  const type = 'clientInputSyntax';
  const schema = getValidateClientSchema({ command });
  validate({ schema, data: args, reportInfo: { type, action, modelName } });
};

// Builds JSON schema to validate against
const getValidateClientSchema = function({ command }) {
  const rule = rules[command.name];
  const properties = getProperties({ rule });
  const requiredProperties = getRequiredProps(rule.required);
  const forbiddenProperties = getForbiddenProperties({ rule });

  const schema = merge(
    { type: 'object', additionalProperties: false },
    properties,
    requiredProperties,
    forbiddenProperties
  );
  return schema;
};

// Get properties to check against, as JSON schema, for a given command.name
const getProperties = function ({ rule }) {
  return validateClientSchema
    // Whitelists input according to `allowed` or `required`
    .filter(({ name }) => {
      return rule.allowed.includes(name) || rule.required.includes(name);
    })
    .map(({ name, value }) => {
      // Fire value functions
      value = typeof value === 'function' ? value(rule) : value;
      // Use `properties` JSON schema syntax
      name = 'properties.' + name.replace(/\./g, '.properties.');
      return { name, value };
    })
    // Handles 'VAR.VAR2' dot-delimited syntax
    .reduce((props, { name, value }) => set(props, name, value), {});
};

// JSON schemas applied to input
const validateClientSchema = [
  {
    name: 'data',
    value: ({ dataMultiple }) => !dataMultiple
      ? { type: 'object' }
      : { type: 'array', items: { type: 'object' } },
  },
  {
    name: 'filter',
    value: {
      typeof: 'function',
      properties: {
        jsl: { type: 'string', pattern: String(jslRegExp) }
      },
    },
  },
  // TODO: re-enabled after we use ORM format for arg.filter
  // { name: 'filter.id', value: ({ isNotJslFilterId }) =>
  //   isNotJslFilterId ? { not: { typeof: 'function' } } : {} },
  {
    name: 'order_by',
    value: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          attrName: { type: 'string' },
          order: { type: 'string', enum: ['asc', 'desc'] },
        },
      },
    },
  },
  { name: 'dry_run', value: { type: 'boolean' } },
  { name: 'no_output', value: { type: 'boolean' } },
  // Other pagination arguments are validated and transformed by
  // pagination middleware, this is just an extra check
  { name: 'limit', value: { type: 'integer' } },
  { name: 'offset', value: { type: 'integer' } },
];

// Transform required properties into JSON schema
// E.g. ['filter', 'filter.var', 'filter.var.vat']
// to { required: ['filter'], properties: { filter: { required: ['var'],
// properties: { var: { required: ['vat'] } } } } }
const getRequiredProps = function (props) {
  // E.g. can be ['filter', 'filter.var', 'filter.var.vat']
  return props
    // E.g. this could transform to ['filter', 'properties.filter.var',
    // 'properties.filter.properties.var.vat']
    .map(requiredProp => {
      const parts = requiredProp.split('.');
      return parts
        .reduce((memo, part, index) => memo
          .concat(index === parts.length - 1 ? [] : 'properties')
          .concat(part),
        [])
        .join('.')
        // Allow using syntax like `data.*.id` when `data` is an array
        .replace('properties.*', 'items');
    })
    // E.g. this could transform to [{ required: ['filter'] },
    // { properties: { filter: { required: ['var'] } } },
    // { properties: { filter: { properties: { var: { required: ['vat'] }}}}}]
    .map(requiredProp => {
      const value = [requiredProp.replace(/.*\./, '')];
      const path = requiredProp.replace(/[^.]+$/, 'required');
      return set({}, path, value);
    })
    // Merge array of objects into single object
    .reduce((memo, value) => {
      return mergeWith(memo, value, (obj, src) => {
        return obj instanceof Array ? obj.concat(src) : undefined;
      });
    }, {});
};

// Add JSON schema forbidding properties
// E.g. `data.id` becomes { properties: { data: { properties: { id: false } } }}
// Only required for nested properties, since `allowed` is whitelisting
const getForbiddenProperties = function ({ rule: { forbidden = [] } }) {
  return forbidden
    .map(forbiddenProp => {
      const prop = forbiddenProp.replace(/\./g, '.properties.');
      return `properties.${prop}`;
    })
    .map(path => set({}, path, false))
    .reduce(merge, {});
};

/**
 * List of rules for allowed|required attributes,
 * according to the current command.name
 * `required` implies `allowed`
 * `dataSingle` is `data` as object, `dataMultiple` is `data` as array.
 **/
/* eslint-disable key-spacing, no-multi-spaces */
const rules = {
  readOne: {
    allowed: [],
    required: ['filter'/*, 'filter.id'*/],
    isNotJslFilterId: true,
  },
  readMany: {
    allowed: ['filter'/*, 'filter.id'*/, 'order_by', 'limit', 'offset'],
    required: [],
  },
  deleteOne: {
    allowed: ['dry_run', 'no_output'],
    required: ['filter'/*, 'filter.id'*/],
    isNotJslFilterId: true,
  },
  deleteMany: {
    allowed: [
      'filter',
      /*'filter.id', */
      'order_by',
      'limit',
      'offset',
      'dry_run',
      'no_output',
    ],
    required: [],
  },
  updateOne: {
    allowed: ['dry_run', 'no_output'],
    required: ['data', 'data.id'],
  },
  updateMany: {
    allowed: ['order_by', 'limit', 'offset', 'dry_run', 'no_output'],
    required: ['data', 'data.*.id'],
    dataMultiple: true,
  },
  createOne: {
    allowed: ['dry_run', 'no_output'],
    required: ['data'],
  },
  createMany: {
    allowed: ['order_by', 'limit', 'offset', 'dry_run', 'no_output'],
    required: ['data'],
    dataMultiple: true,
  },
};
/* eslint-enable key-spacing, no-multi-spaces */


module.exports = {
  validateClientInputSyntax,
};
