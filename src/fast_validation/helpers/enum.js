'use strict';

const { getWordsList } = require('../../utilities');

const enumTest = (name, values) => ({
  test ({ [name]: value }) {
    if (value == null) { return true; }

    return values.includes(value);
  },
  message: `'${name}' must be ${getWordsList(values, { json: true })}`,
});

module.exports = {
  enumTest,
};
