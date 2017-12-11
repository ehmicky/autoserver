'use strict';

const { mapAttrs } = require('../helpers');

// Make sure `id` attributes are required
const addRequiredId = function ({ schema }) {
  return mapAttrs({ func: mapAttr, schema });
};

const mapAttr = function ({
  attr: { validate, validate: { required } },
  attrName,
}) {
  if (attrName !== 'id' || required) { return; }

  return { validate: { ...validate, required: true } };
};

module.exports = {
  addRequiredId,
};
