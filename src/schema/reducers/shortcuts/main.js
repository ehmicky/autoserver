'use strict';

const maps = require('./maps');
const { mapAllColls } = require('./helper');

// Startup transformations just meant for runtime performance optimization
const normalizeShortcuts = function ({ schema }) {
  const shortcuts = Object.entries(maps)
    .map(([name, input]) => normalizeShortcut({ name, input, schema }));
  const shortcutsA = Object.assign({}, ...shortcuts);
  return { shortcuts: shortcutsA };
};

const normalizeShortcut = function ({ name, input, schema }) {
  const shortcut = mapAllColls({ schema }, input);
  return { [name]: shortcut };
};

module.exports = {
  normalizeShortcuts,
};
