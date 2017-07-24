'use strict';

const { isEqual } = require('lodash');

const { omitBy } = require('../../../../utilities');

const removeDefaultValues = function (token) {
  return omitBy(token, (value, attrName) =>
    isEqual(value, defaultValues[attrName])
  );
};

const addDefaultValues = function (token) {
  return Object.assign({}, defaultValues, token);
};

const defaultValues = {
  nFilter: '(true)',
  nOrderBy: [{ attrName: 'id', order: 'asc' }],
};

module.exports = {
  removeDefaultValues,
  addDefaultValues,
};
