'use strict';

const { mapValues, pickBy } = require('../../utilities');

// Gets a map of models' readonly attributes,
// e.g. { my_model: ['my_readonly_attribute', ...], ... }
const getReadOnlyMap = function ({ idl: { models } }) {
  return mapValues(models, ({ properties = {} }) => {
    const readOnlyProps = pickBy(properties, ({ readOnly }) => readOnly);
    return Object.keys(readOnlyProps);
  });
};

module.exports = {
  getReadOnlyMap,
};
