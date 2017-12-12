'use strict';

const { mapAttrs } = require('../helpers');

// Make sure `id` attributes are required
const mapAttr = function ({
  attr: { validate, validate: { required } },
  attrName,
}) {
  if (attrName !== 'id' || required) { return; }

  return { validate: { ...validate, required: true } };
};

const addRequiredId = mapAttrs.bind(null, mapAttr);

module.exports = {
  addRequiredId,
};
