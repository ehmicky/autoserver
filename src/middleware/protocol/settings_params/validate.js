'use strict';

// Generic settings|params validation
const validateValues = function ({ values, type: { validateValue } }) {
  return Object.entries(values).reduce(
    (valuesA, [name, value]) => validateValue({ values: valuesA, name, value }),
    values,
  );
};

module.exports = {
  validateValues,
};
