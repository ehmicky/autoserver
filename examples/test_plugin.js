'use strict';

const { promisify } = require('util');
const { nextTick } = require('process');

const testPlugin = async function ({ config, opts: { example_option: opt } }) {
  await promisify(nextTick)();

  return { ...config, $plugin_attr: opt };
};

module.exports = testPlugin;
