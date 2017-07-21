'use strict';

const { omit, assignObject } = require('../../../../utilities');

// Name shortcuts, e.g. { nFilter: value } -> { f: value }
const addNameShortcuts = function (token) {
  const shortcuts = namesShortcuts
    .filter(({ from }) => token[from] !== undefined)
    .map(({ from, to }) => ({ [to]: token[from] }))
    .reduce(assignObject, {});
  const attrsToRemove = namesShortcuts
    .filter(({ from }) => token[from] !== undefined)
    .map(({ from }) => from);
  return Object.assign({}, omit(token, attrsToRemove), shortcuts);
};

const removeNameShortcuts = function (token) {
  const shortcuts = namesShortcuts
    .filter(({ to }) => token[to] !== undefined)
    .map(({ from, to }) => ({ [from]: token[to] }))
    .reduce(assignObject, {});
  const attrsToRemove = namesShortcuts
    .filter(({ to }) => token[to] !== undefined)
    .map(({ to }) => to);
  return Object.assign({}, omit(token, attrsToRemove), shortcuts);
};

const namesShortcuts = [
  { from: 'nFilter', to: 'f' },
  { from: 'nOrderBy', to: 'o' },
  { from: 'parts', to: 'p' },
];

module.exports = {
  addNameShortcuts,
  removeNameShortcuts,
};
