'use strict';


const { chain, mapValues } = require('lodash');


/**
 * Returns a simplified map of all the models in the IDL
 * Example: { my_model: { my_sub_model: { multiple: true, model: 'another_model' } } }
 **/
const getModelsMap = function ({ idl }) {
  return mapValues(idl.models, value => {
    const properties = value.properties;
    return chain(properties)
      .mapValues(prop => {
        const multiple = prop.items !== undefined;
        const model = multiple ? prop.items.model : prop.model;
        return { multiple, model };
      })
      .pickBy(prop => prop.model)
      .value();
    }
  );
};


module.exports = {
  getModelsMap,
};
