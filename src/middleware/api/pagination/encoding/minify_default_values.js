'use strict';


const { isEqual } = require('lodash');


const removeDefaultValues = function ({ token }) {
  for (const [attrName, value] of Object.entries(defaultValues)) {
    if (!isEqual(value, token[attrName])) { continue; }
    delete token[attrName];
  }
};

const addDefaultValues = function ({ token }) {
  for (const [attrName, value] of Object.entries(defaultValues)) {
    if (token[attrName] !== undefined) { continue; }
    token[attrName] = value;
  }
};

const defaultValues = {
  filter: '(true)',
  orderBy: [{ attrName: 'id', order: 'asc' }],
};


module.exports = {
  removeDefaultValues,
  addDefaultValues,
};
