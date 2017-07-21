'use strict';

const { mapModels } = require('./helper');

// Gets a map of models' readonly attributes,
// e.g. { my_model: ['my_readonly_attribute', ...], ... }
const getReadOnlyMap = function ({ idl: { models } }) {
  return mapModels({ models, filter: 'readOnly', mapProps });
};

const mapProps = props => Object.keys(props);

module.exports = {
  getReadOnlyMap,
};
