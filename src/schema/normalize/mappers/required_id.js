'use strict';

// Make sure `id` attributes are required
const addRequiredId = function (attr, { attrName }) {
  const { validate, validate: { required } } = attr;
  if (attrName !== 'id' || required) { return attr; }

  return { ...attr, validate: { ...validate, required: true } };
};

module.exports = {
  addRequiredId,
};
