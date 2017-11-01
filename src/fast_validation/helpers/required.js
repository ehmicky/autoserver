'use strict';

const { isEqual, get, getWordsList } = require('../../utilities');

const requiredTest = name => ({
  test (value) {
    return get(value, name.split('.')) != null;
  },
  message: 'must be defined',
});

const forbiddenTest = name => ({
  test (value) {
    return get(value, name.split('.')) == null;
  },
  message: 'must not be defined',
});

const unknownTest = (name, attributes) => ({
  test (value) {
    const val = get(value, name.split('.'));
    const keys = Object.keys(val);

    return isEqual(keys, attributes);
  },
  message () {
    const attrNames = getWordsList(attributes, { quotes: true });
    return `'${name}' must only contain ${attrNames}`;
  },
});

module.exports = {
  requiredTest,
  forbiddenTest,
  unknownTest,
};
