'use strict';

const mapProp = prop => prop.default;

// Retrieves map of models's attributes for which a default value is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const userDefaultsMap = { filter: 'default', mapProp };

module.exports = {
  userDefaultsMap,
};
