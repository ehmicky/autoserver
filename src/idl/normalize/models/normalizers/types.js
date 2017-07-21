'use strict';

const { mapValues } = require('../../../../utilities');

// Add modelType `model` to top-level models, `attribute` to model attributes
// (including nested models)
// Used as extra hints for transforms
const addModelType = function ({ models }) {
  return mapValues(models, model => {
    const properties = mapValues(model.properties, oProp => {
      const prop = Object.assign({}, oProp, { modelType: 'attribute' });

      if (prop.items) {
        prop.items = Object.assign({}, prop.items, { modelType: 'attribute' });
      }

      return prop;
    });
    return Object.assign({}, model, { modelType: 'model', properties });
  });
};

module.exports = {
  addModelType,
};
