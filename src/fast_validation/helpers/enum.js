'use strict';

const { getWordsList } = require('../../utilities');

const enumTest = (name, values) => ({
  test (arg) {
    const { [name]: value } = arg;

    if (value == null) { return true; }

    return values.includes(value);
  },
  message: `'${name}' must be ${getWordsList(values, { json: true })}`,
});

module.exports = {
  enumTest,
};
