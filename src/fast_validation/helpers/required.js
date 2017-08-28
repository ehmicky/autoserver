'use strict';

const requiredTest = name => ({
  test ({ [name]: value }) {
    return value != null;
  },
  message: 'must be defined',
});

const forbiddenTest = name => ({
  test ({ [name]: value }) {
    return value == null;
  },
  message: 'must not be defined',
});

module.exports = {
  requiredTest,
  forbiddenTest,
};
