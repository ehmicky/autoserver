'use strict';

const { promisify } = require('util');

const testPlugin = async function ({ config, opts: { example_option: opt } }) {
  await promisify(process.nextTick)();

  return { ...config, $plugin_attr: opt };
};

module.exports = testPlugin;
