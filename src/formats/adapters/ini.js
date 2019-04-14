'use strict'

const { parse: iniParse, stringify: iniStringify } = require('ini')

const { fullRecurseMap } = require('../../utils/functional/map.js')

// Parses an INI file
const parse = function({ content }) {
  return iniParse(content)
}

// Serializes an INI file
const serialize = function({ content }) {
  const contentA = fullRecurseMap(content, escapeEmptyArrays)
  return iniStringify(contentA)
}

// Empty arrays are ignored by `node-ini`, so we need to escape them
const escapeEmptyArrays = function(val) {
  const isEmptyArray = Array.isArray(val) && val.length === 0

  if (!isEmptyArray) {
    return val
  }

  return '[]'
}

const ini = {
  name: 'ini',
  title: 'INI',
  extensions: ['ini', 'in', 'cfg', 'conf'],
  mimeExtensions: ['+ini'],
  // `node-ini` only supports UTF-8
  charsets: ['utf-8'],
  jsonCompat: ['subset'],
  parse,
  serialize,
}

module.exports = {
  ini,
}
