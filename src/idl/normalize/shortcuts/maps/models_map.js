'use strict';

const mapProp = function ({ items, model }) {
  const multiple = items !== undefined;
  const itemsModel = multiple ? items.model : model;
  return { multiple, model: itemsModel };
};

/**
 * Returns a simplified map of all the models in the IDL
 * Example: { my_model: { my_sub_model:
 * { multiple: true, model: 'another_model' } } }
 **/
const modelsMap = { mapProp };

module.exports = {
  modelsMap,
};
