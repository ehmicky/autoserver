'use strict';

const { mapModels } = require('./map_helper');

// Retrieves map of models's attributes for which a default value is defined
// E.g. { User: { name: 'default_name', ... }, ... }
const getUserDefaultsMap = function ({ idl: { models } }) {
  return mapModels({ models, filter, mapProp });
};

// Required values do not have default values
const filter = function (prop, propName, { required = [] }) {
  return prop.default !== undefined && !required.includes(propName);
};

const mapProp = prop => prop.default;

module.exports = {
  getUserDefaultsMap,
};
