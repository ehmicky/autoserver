'use strict';


const { chain } = require('lodash');

const { validate } = require('../../utilities');


/**
 * Check API input, for client-side errors (e.g. 400)
 * Only checks basic input according to current operation
 * In a nutshell, checks that:
 *  - required attributes are defined
 *  - disabled attributes are not defined
 *  - `id` is not an array, `ids` is an array, `filters` is an object, `data` is an array or object (depending on operation)
 *  - `order_by` syntax looks valid (does not check whether it is semantically correct)
 **/
const validateClientInputSyntax = function ({ operation, args }) {
  const type = 'clientInputSyntax';
  const schema = getValidateClientSchema({ operation });
  const data = { elem: args };
  validate({ schema, data, type });
};

// Builds JSON schema to validate against
const getValidateClientSchema = function({ operation }) {
  const rule = rules[operation];
  const properties = chain(validateClientSchema)
    .mapValues(rawProp => typeof rawProp === 'function' ? rawProp(rule) : rawProp)
    // Whitelists input according to `allowed` or `required`
    .pickBy((_, propName) => rule.allowed.includes(propName) || rule.required.includes(propName))
    .value();
  return { type: 'object', required: rule.required, properties, additionalProperties: false };
};

// JSON schemas applies to input
const validateClientSchema = {
  data: ({ dataMultiple }) => !dataMultiple ? { type: 'object' } : { type: 'array', items: { type: 'object' } },
  filters: { type: 'object' },
  id: { not: { type: 'array' } },
  ids: { type: 'array' },
  // Matches order_by value, i.e. 'ATTR[+|-],...'
  order_by: { type: 'string', pattern: '^([a-z0-9_]+[+-]?)(,[a-z0-9_]+[+-]?)*$' },
};

/**
 * List of rules for allowed|required attributes, according to the current operation
 * `required` implies `allowed`
 * `dataSingle` is `data` as object, `dataMultiple` is `data` as array
 **/
/* eslint-disable key-spacing, no-multi-spaces */
const rules = {
  findOne:      { allowed: ['filters', 'order_by'],         required: ['id']                                },
  findMany:     { allowed: ['filters', 'ids', 'order_by'],  required: []                                    },
  deleteOne:    { allowed: ['filters', 'order_by'],         required: ['id']                                },
  deleteMany:   { allowed: ['filters', 'ids', 'order_by'],  required: []                                    },
  updateOne:    { allowed: ['filters', 'order_by'],         required: ['data', 'id']                        },
  updateMany:   { allowed: ['filters', 'ids', 'order_by'],  required: ['data']                              },
  upsertOne:    { allowed: ['order_by'],                    required: ['data', 'id']                        },
  upsertMany:   { allowed: ['order_by'],                    required: ['data', 'ids'],  dataMultiple: true  },
  replaceOne:   { allowed: ['order_by'],                    required: ['data', 'id']                        },
  replaceMany:  { allowed: ['order_by'],                    required: ['data', 'ids'],  dataMultiple: true  },
  createOne:    { allowed: ['id', 'order_by'],              required: ['data']                              },
  createMany:   { allowed: ['ids', 'order_by'],             required: ['data'],         dataMultiple: true  },
};
/* eslint-enable key-spacing, no-multi-spaces */


module.exports = {
  validateClientInputSyntax,
};
