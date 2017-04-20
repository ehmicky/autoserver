'use strict';


const { set, merge, mergeWith } = require('lodash');

const { validate } = require('../../utilities');


/**
 * Check API input, for client-side errors (e.g. 400)
 * Only checks basic input according to current operation
 * In a nutshell, checks that:
 *  - required attributes are defined
 *  - disabled attributes are not defined
 *  - `id` is not an array, `ids` is an array, `filter` is an object, `data` is an array or object (depending on operation)
 *  - `order_by` syntax looks valid (does not check whether it is semantically correct)
 **/
const validateClientInputSyntax = function ({ modelName, operation, args }) {
  const type = 'clientInputSyntax';
  const schema = getValidateClientSchema({ operation });
  validate({ schema, data: args, reportInfo: { type, operation, modelName } });
};

// Builds JSON schema to validate against
const getValidateClientSchema = function({ operation }) {
  const rule = rules[operation];
  const properties = getProperties({ rule });
  const requiredProperties = getRequiredProps(rule.required);
  const forbiddenProperties = getForbiddenProperties({ rule });

  const schema = merge({ type: 'object', additionalProperties: false }, properties, requiredProperties, forbiddenProperties);
  return schema;
};

// Get properties to check against, as JSON schema, for a given operation
const getProperties = function ({ rule }) {
  return validateClientSchema
    // Whitelists input according to `allowed` or `required`
    .filter(({ name }) => rule.allowed.includes(name) || rule.required.includes(name))
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
  { name: 'data', value: ({ dataMultiple }) => !dataMultiple ? { type: 'object' } : { type: 'array', items: { type: 'object' } } },
  { name: 'filter', value: { type: 'object' } },
  { name: 'filter.id', value: ({ idMultiple }) => !idMultiple ? { not: { type: 'array' } } : { type: 'array', } },
  // Matches order_by value, i.e. 'ATTR[+|-],...'
  { name: 'order_by', value: { type: 'string', pattern: '^([a-z0-9_]+[+-]?)(,[a-z0-9_]+[+-]?)*$' } },
];

// Transform required properties into JSON schema
// E.g. ['filter', 'filter.var', 'filter.var.vat']
// to { required: ['filter'], properties: { filter: { required: ['var'], properties: { var: { required: ['vat'] } } } } }
const getRequiredProps = function (props) {
  // E.g. can be ['filter', 'filter.var', 'filter.var.vat']
  return props
    // E.g. this could transform to ['filter', 'properties.filter.var', 'properties.filter.properties.var.vat']
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
    // E.g. this could transform to [{ required: ['filter'] }, { properties: { filter: { required: ['var'] } } },
    // { properties: { filter: { properties: { var: { required: ['vat'] } } } } }]
    .map(requiredProp => {
      const value = [requiredProp.replace(/.*\./, '')];
      const path = requiredProp.replace(/[^.]+$/, 'required');
      return set({}, path, value);
    })
    // Merge array of objects into single object
    .reduce((memo, value) => mergeWith(memo, value, (obj, src) => obj instanceof Array ? obj.concat(src) : undefined), {});
};

// Add JSON schema forbidding properties
// E.g. `data.id` becomes { properties: { data: { properties: { id: false } } } }
// Only required for nested properties, since `allowed` is whitelisting
const getForbiddenProperties = function ({ rule: { forbidden = [] } }) {
  return forbidden
    .map(forbiddenProp => 'properties.' + forbiddenProp.replace(/\./g, '.properties.'))
    .map(path => set({}, path, false))
    .reduce(merge, {});
};

/**
 * List of rules for allowed|required attributes, according to the current operation
 * `required` implies `allowed`
 * `dataSingle` is `data` as object, `dataMultiple` is `data` as array. Same for `idMultiple`
 **/
/* eslint-disable key-spacing, no-multi-spaces */
const rules = {
  findOne:      { allowed: [],                                      required: ['filter', 'filter.id'],                    },
  findMany:     { allowed: ['filter', 'filter.id', 'order_by'],     required: [],
                  idMultiple: true                                                                                        },
  deleteOne:    { allowed: [],                                      required: ['filter', 'filter.id']                     },
  deleteMany:   { allowed: ['filter', 'filter.id', 'order_by'],     required: [],
                  idMultiple: true                                                                                        },
  updateOne:    { allowed: [],                                      required: ['data', 'filter', 'filter.id'],
                                                                    forbidden: ['data.id']                                },
  updateMany:   { allowed: ['filter', 'filter.id', 'order_by'],     required: ['data'],
                  idMultiple: true,                                 forbidden: ['data.id']                                },
  upsertOne:    { allowed: [],                                      required: ['data', 'data.id']                         },
  upsertMany:   { allowed: ['order_by'],                            required: ['data', 'data.*.id'],
                  dataMultiple: true                                                                                      },
  replaceOne:   { allowed: [],                                      required: ['data', 'data.id']                         },
  replaceMany:  { allowed: ['order_by'],                            required: ['data', 'data.*.id'],
                  dataMultiple: true                                                                                      },
  createOne:    { allowed: [],                                      required: ['data']                                    },
  createMany:   { allowed: ['order_by'],                            required: ['data'],
                  dataMultiple: true                                                                                      },
};
/* eslint-enable key-spacing, no-multi-spaces */


module.exports = {
  validateClientInputSyntax,
};
