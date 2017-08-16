'use strict';

const { isEqual } = require('lodash');

const { omitBy } = require('../../../../utilities');

const removeDefaultValues = function (token) {
  return omitBy(token, (value, attrName) =>
    isEqual(value, defaultValues[attrName])
  );
};

const addDefaultValues = function (token) {
  return { ...defaultValues, ...token };
};

const defaultValues = {
  filter: {},
  nOrderBy: [{ attrName: 'id', order: 'asc' }],
};

module.exports = {
  removeDefaultValues,
  addDefaultValues,
};
