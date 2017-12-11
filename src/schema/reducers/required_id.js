'use strict';

const { mapAttrs } = require('../helpers');

// Make sure `id` attributes are required
const addRequiredId = function ({ schema }) {
  return mapAttrs({ func: mapAttr, schema });
};

const mapAttr = function ({ attr, attrName }) {
  const { validate, validate: { required } } = attr;
  if (attrName !== 'id' || required) { return attr; }

  return { ...attr, validate: { ...validate, required: true } };
};

module.exports = {
  addRequiredId,
};
