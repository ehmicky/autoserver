'use strict';

// Required values do not have default values
const filter = function (prop, propName, { required = [] }) {
  return prop.default !== undefined && !required.includes(propName);
};

const mapProp = prop => prop.default;

// Retrieves map of models's attributes for which a default value is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const userDefaultsMap = { filter, mapProp };

module.exports = {
  userDefaultsMap,
};
