'use strict';

const { findDuplicate } = require('../../../utilities');

// `validate.unique` rule
const validateUnique = function ({ optVal, ruleVal }) {
  if (!ruleVal || !Array.isArray(optVal)) { return; }

  const duplicateVal = findDuplicate(optVal);
  if (duplicateVal === undefined) { return; }

  return `must not contain duplicate value: ${JSON.stringify(duplicateVal)}`;
};

module.exports = {
  unique: validateUnique,
};
