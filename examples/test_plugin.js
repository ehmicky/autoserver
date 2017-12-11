'use strict';

const { promisify } = require('util');

const testPlugin = async function ({ schema, opts: { example_option: opt } }) {
  await promisify(process.nextTick)();

  return { ...schema, $plugin_attr: opt };
};

module.exports = testPlugin;
