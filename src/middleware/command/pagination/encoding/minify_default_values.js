'use strict';

const { isEqual } = require('lodash');

const removeDefaultValues = function ({ token }) {
  for (const [attrName, value] of Object.entries(defaultValues)) {
    if (isEqual(value, token[attrName])) {
      delete token[attrName];
    }
  }
};

const addDefaultValues = function ({ token }) {
  for (const [attrName, value] of Object.entries(defaultValues)) {
    if (token[attrName] === undefined) {
      token[attrName] = value;
    }
  }
};

const defaultValues = {
  nFilter: '(true)',
  nOrderBy: [{ attrName: 'id', order: 'asc' }],
};

module.exports = {
  removeDefaultValues,
  addDefaultValues,
};
