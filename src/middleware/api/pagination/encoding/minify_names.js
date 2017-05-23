'use strict';


// Name shortcuts, e.g. { filter: value } -> { f: value }
const addNameShortcuts = function ({ token }) {
  for (let { from, to } of namesShortcuts) {
    if (token[from] !== undefined) {
      token[to] = token[from];
      delete token[from];
    }
  }
};

const removeNameShortcuts = function ({ token }) {
  for (let { from, to } of namesShortcuts) {
    if (token[to] !== undefined) {
      token[from] = token[to];
      delete token[to];
    }
  }
};

const namesShortcuts = [
  { from: 'filter', to: 'f' },
  { from: 'orderBy', to: 'o' },
  { from: 'parts', to: 'p' },
];


module.exports = {
  addNameShortcuts,
  removeNameShortcuts,
};
