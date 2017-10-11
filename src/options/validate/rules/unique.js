'use strict';

// `validate.unique` rule
const validateUnique = function ({ optVal, ruleVal }) {
  if (!ruleVal || !Array.isArray(optVal)) { return; }

  const duplicateVal = optVal
    .find((val, index) => optVal.slice(index + 1).includes(val));
  if (duplicateVal === undefined) { return; }

  return `must not contain duplicate value: ${JSON.stringify(duplicateVal)}`;
};

module.exports = {
  unique: validateUnique,
};
