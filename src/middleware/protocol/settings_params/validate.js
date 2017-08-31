'use strict';

// Generic settings|params validation
const validateValues = function ({ values, type: { validateValue } }) {
  return Object.entries(values)
    .forEach(([name, value]) => validateValue({ name, value }));
};

module.exports = {
  validateValues,
};
