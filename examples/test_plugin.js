'use strict'

const { nextTick } = require('process')
const { promisify } = require('util')

const testPlugin = async function ({ config, opts: { example_option: opt } }) {
  await promisify(nextTick)()

  return { ...config, $plugin_attr: opt }
}

module.exports = testPlugin
