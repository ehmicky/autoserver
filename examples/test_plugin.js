'use strict';

const { promisify } = require('util');

const testPlugin = async function ({ schema, opts: { example_option } }) {
  await promisify(process.nextTick)();

  return { ...schema, $plugin_attr: example_option };
};

module.exports = testPlugin;
