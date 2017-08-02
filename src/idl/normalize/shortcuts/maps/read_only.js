'use strict';

const mapAttrs = attrs => Object.keys(attrs);

// Gets a map of models' readonly attributes,
// e.g. { my_model: ['my_readonly_attribute', ...], ... }
const readOnlyMap = {
  filter: 'readOnly',
  mapAttrs,
};

module.exports = {
  readOnlyMap,
};
