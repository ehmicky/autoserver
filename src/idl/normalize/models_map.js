'use strict';


const { mapValues } = require('lodash');


/**
 * Returns a simplified map of all the models in the IDL
 * Example: { my_model: { my_sub_model:
 * { multiple: true, model: 'another_model' } } }
 **/
const getModelsMap = function ({ idl }) {
  return mapValues(idl.models, ({ properties }) => {
    return mapValues(properties, prop => {
      const multiple = prop.items !== undefined;
      const model = multiple ? prop.items.model : prop.model;
      return { multiple, model };
    });
  });
};


module.exports = {
  getModelsMap,
};
