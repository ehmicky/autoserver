'use strict';

const { mapValues, pickBy } = require('../../utilities');

// Retrieves map of models's attributes for which a default value is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const getUserDefaultsMap = function ({ idl: { models } }) {
  return mapValues(models, ({ properties = {}, required = [] }) => {
    const propDefaults = mapValues(properties, prop => prop.default);
    return pickBy(propDefaults, (defValue, propName) =>
      // Required values do not have default values
      defValue !== undefined && !required.includes(propName)
    );
  });
};

module.exports = {
  getUserDefaultsMap,
};
