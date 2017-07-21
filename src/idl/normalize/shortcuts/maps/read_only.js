'use strict';

const mapProps = props => Object.keys(props);

// Gets a map of models' readonly attributes,
// e.g. { my_model: ['my_readonly_attribute', ...], ... }
const readOnlyMap = {
  filter: 'readOnly',
  mapProps,
};

module.exports = {
  readOnlyMap,
};
