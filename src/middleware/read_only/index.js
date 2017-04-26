'use strict';


const { chain, pickBy, intersection, flatten } = require('lodash');
const { surround, toSentence } = require('underscore.string');

const { EngineError } = require('../../error');


/**
 * Validates `schema.readOnly`, which prevents an attribute from being updated.
 * It can still use default|transforms, which is why this is fired before the main input validation layer.
 **/
const validateReadOnly = async function ({ idl }) {
  // Gets a map of models' readonly attributes, e.g. { my_model: ['my_readonly_attribute', ...], ... }
  const readOnlyMap = chain(idl.models)
    .pickBy(modelIdl => modelIdl && modelIdl.properties)
    .mapValues(modelIdl => Object.keys(pickBy(modelIdl.properties, prop => prop.readOnly)))
    .value();

  return async function (input) {
    const { args: { data }, modelName } = input;

    // Check if any attribute in `data` is matching readonly attributes from IDL
    if (data) {
      const dataKeys = data instanceof Array ? flatten(data.map(Object.keys)) : Object.keys(data);
      const readOnlyAttributes = readOnlyMap[modelName];
      const readOnlyDataKeys = intersection(dataKeys, readOnlyAttributes);

      // Report errors as a client-side exception
      if (readOnlyDataKeys.length > 0) {
        const keys = toSentence(readOnlyDataKeys.map(key => surround(key, '\'')));
        throw new EngineError(`Cannot update readonly attributes: ${keys}`, { reason: 'INPUT_VALIDATION' });
      }
    }

    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  validateReadOnly,
};
