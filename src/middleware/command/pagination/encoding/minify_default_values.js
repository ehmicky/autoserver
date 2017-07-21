'use strict';

const { isEqual } = require('lodash');

const { omit, assignObject } = require('../../../../utilities');

const removeDefaultValues = function (token) {
  const attrsToRemove = Object.entries(defaultValues)
    .filter(([attrName, value]) => isEqual(value, token[attrName]))
    .map(([attrName]) => attrName);
  return omit(token, attrsToRemove);
};

const addDefaultValues = function (token) {
  const attrsToAdd = Object.entries(defaultValues)
    .filter(([attrName]) => token[attrName] === undefined)
    .map(([attrName, value]) => ({ [attrName]: value }))
    .reduce(assignObject, {});
  return Object.assign({}, token, attrsToAdd);
};

const defaultValues = {
  nFilter: '(true)',
  nOrderBy: [{ attrName: 'id', order: 'asc' }],
};

module.exports = {
  removeDefaultValues,
  addDefaultValues,
};
