'use strict';

const { mapAttrs } = require('../helpers');

// Add JSON schema validation based on `type`
const addTypeValidation = function ({ schema }) {
  return mapAttrs({ func: mapAttr, schema });
};

const mapAttr = function ({ attr }) {
  if (!attr.type) { return attr; }

  if (!attr.isArray) { return addSingleValidation(attr); }

  return addMultipleValidation(attr);
};

const addSingleValidation = function (attr) {
  const { type, validate } = attr;

  return {
    ...attr,
    validate: {
      ...validate,
      type,
    },
  };
};

const addMultipleValidation = function (attr) {
  const { type, validate, validate: { items = {} } } = attr;

  return {
    ...attr,
    validate: {
      ...validate,
      type: 'array',
      items: { ...items, type },
    },
  };
};

module.exports = {
  addTypeValidation,
};
