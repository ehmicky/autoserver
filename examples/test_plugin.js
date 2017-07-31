'use strict';

const { promisify } = require('util');

const testPlugin = async function ({ idl, opts: { exampleOption } }) {
  // Plugins can be async
  await promisify(process.nextTick)();

  return { ...idl, 'x-plugin-attr': exampleOption };
};

module.exports = testPlugin;
