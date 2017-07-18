'use strict';

// Name shortcuts, e.g. { nFilter: value } -> { f: value }
const addNameShortcuts = function ({ token }) {
  for (const { from, to } of namesShortcuts) {
    if (token[from] !== undefined) {
      token[to] = token[from];
      delete token[from];
    }
  }
};

const removeNameShortcuts = function ({ token }) {
  for (const { from, to } of namesShortcuts) {
    if (token[to] !== undefined) {
      token[from] = token[to];
      delete token[to];
    }
  }
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
